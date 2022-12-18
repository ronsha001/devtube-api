isRelease = false
isFeature = false
pipeline {
  agent any

  stages {
    stage ("Init") {
      steps {
        script {
          if (env.BRANCH_NAME =~ "^release/*") {
            isRelease = true
            echo "IS RELEASE"
          }
          if (env.BRANCH_NAME =~ "^feature/*") {
            isFeature = true
            echo "IS FEATURE"
          }
        }
      }
    }

    stage ("Version") {
      steps {
        script {
          if (isRelease) {
            echo "Start Version Stage"
            version = "${env.BRANCH_NAME}".split('/')[1]
            // Fetch all tags
            sh "git fetch --all --tags"
            // Print tags
            sh 'git tag'
            // Find latest tag and generate new one
            try {
              newTag = Integer.parseInt( sh(script: "git tag | grep ^${version} | sort --version-sort | tail -1 | cut -d '.' -f 3", returnStdout: true).trim() )
            } catch (Exception e) {
              newTag = null
            }
            if (newTag == null) {
              newTag = 0
            } else {
              newTag += 1
            }
            newVersion = "${version}.${newTag}"
            echo "~~~ New Version: ${newVersion} ~~~"
          }
          
        }
      }
    }
    stage ("Build") {
      steps {
        script {
          if (isRelease || isFeature) {
            echo "Start Build Stage"
            usingBuild = sh(script: "yq '.services.api.build' docker-compose.yaml", returnStdout: true)
            if (usingBuild) {
              sh 'yq \'(.services.api.build | key) = \"image\" \' docker-compose.yaml | sponge docker-compose.yaml' // Replace key name 'build' to 'image'
            }
            sh 'yq \'(.services.api.image = \"test-api\" )\' docker-compose.yaml | sponge docker-compose.yaml' // Replace image value to actual api-test image
            sh "yq 'del(.services.mongo.volumes, .volumes)' docker-compose.yaml | sponge docker-compose.yaml" // Delete mongo's service volume
            sh """
              docker build -t test-api .
              cat docker-compose.yaml
              docker-compose up -d
            """
          }
        }
      }
    }
    stage ("Tests") {
      steps {
        script {
          echo "Start Tests Stage"
          if (isRelease || isFeature) {
            dir('tests') {
              sh "wget --tries=10 --waitretry=5 --retry-connrefused --retry-on-http-error=502 -O- http://localhost:3001/api/videos/random"
              sh 'python3 api-unitTest.py'
            }
          }
        }
      }
    }
    stage ("Publish") {
      steps {
        parallel (
          "publish" : {
            script {
              if (isRelease) {
                echo "Start Publish Stage"
                sh """
                  az login --identity
                  az acr login --name devtube
                  docker tag test-api devtube.azurecr.io/devtube-api:${newVersion}
                  docker push devtube.azurecr.io/devtube-api:${newVersion}
                """
              }
            }
          },
          "tag" : {
            script {
              if (isRelease) {
                sh "git checkout -b release/${version}"
                sh "git clean -f"
                sh "git tag ${newVersion}"
                sh "git push --tags"
              }
            }
          },
          "update-chart" : {
            script {
              if (isRelease) {
                sh "git clone git@github.com:ronsha001/devtube-chart.git"
                echo "Update chart with new api image tag: ${newVersion}"
                dir("devtube-chart/devtube") {
                  sh """
                    yq \'(.api.image_tag = \"${newVersion}\" )\' values.yaml | sponge values.yaml
                    git commit -am \"jenkins-api-update, version: ${newVersion}\"
                    git push origin master
                  """
                }
              }
            }
          }
        )
      }
    }
  }
  post {
    always {
      sh """
        docker-compose down
        docker image rm test-api
      """
      script {
        if (isRelease) {
          sh "docker image rm devtube.azurecr.io/devtube-api:${newVersion}"
        }
      }
    }
    failure {
      script {
        if (isFeature || isRelease) {
          emailext (
            subject: "Jenkins - ${env.JOB_NAME}, build ${env.BUILD_DISPLAY_NAME} - ${currentBuild.currentResult}",
            to: 'ronsh0111@gmail.com',
            body:    """
            <p>Jenkins job <a href='${env.JOB_URL}'>${env.JOB_NAME}</a> (<a href='${env.BUILD_URL}'>build ${env.BUILD_DISPLAY_NAME}</a>) has result <strong>${currentBuild.currentResult}</strong>!
            <br>You can view the <a href='${env.BUILD_URL}console'>console log here</a>.</p>
            <p>Source code from commit: <a href='${env.GIT_URL}/commit/${env.GIT_COMMIT}'>${env.GIT_COMMIT}</a> (of branch <em>${env.GIT_BRANCH}</em>).</p>
            <p><img src='https://www.jenkins.io/images/logos/jenkins/jenkins.png' alt='jenkins logo' width='123' height='170'></p>
            """
          )
        }
      }
    }
  }
}