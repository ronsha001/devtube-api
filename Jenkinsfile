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
          }
          "tag" : {
            script {
              if (isRelease) {
                sh "git checkout -b release/${version}"
                sh "git clean -f"
                sh "git tag ${newVersion}"
                sh "git push --tags"
              }
            }
          }
          "update-chart" : {
            script {
              if (isRelease) {
                // TODO
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
        docker image rm devtube.azurecr.io/devtube-api:${newVersion}
      """
    }
  }
}