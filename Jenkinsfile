isRelease = false

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
        }
      }
    }

    stage ("Version") {
      steps {
        script {
          if (isRelease) {
            version = "${env.BRANCH_NAME}".split('/')[1]
            // Fetch all tags
            sh 'ls -al'
            sh 'git remote -v'
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
          if (isRelease) {
            usingBuild = sh(script: "yq '.services.api.build' docker-compose.yaml", returnStdout: true)
            if (usingBuild) {
              sh 'yq \'(.services.api.build | key) = "image"\' docker-compose.yaml' // Replace key name 'build' to 'image'
            }
            sh 'yq \'(.services.api.image = "test-api")\' docker-compose.yaml' // Replace image value to actual api-test image
            sh "yq 'del(.services.mongo.volumes, .volumes)' docker-compose.yaml' docker-compose.yaml" // Delete mongo's service volume
            sh '''
              docker build -t test-api .
              docker-compose up -d
            '''
          }
        }
      }
    }
    stage ("E2E Tests") {
      steps {
        script {
          if (isRelease) {
            dir('tests') {
              sh 'python3 api-unitTest.py'
            }
          }
        }
      }
    }
    // stage ("Publish") {
    //   steps {
    //     parallel (
    //       "publish" : {
    //         script {
    //           if (isRelease) {
    //             // TODO
    //           }
    //         }
    //       },
    //       "tag" : {
    //         script {
    //           if (isRelease) {
    //             sh "git checkout -b release/${version}"
    //             sh "git clean -f"
    //             sh "git tag ${newVersion}"
    //             sh "git push --tags"
    //           }
    //         }
    //       }
    //     )
    //   }
    // }
  }
  post {
    always {
      sh '''
        docker-compose down
        docker image rm api-test
      '''
    }
  }
}