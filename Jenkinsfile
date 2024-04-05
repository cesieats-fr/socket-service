pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS = credentials('DOCKER_CREDENTIALS')
    }

    stages {
        stage("Docker build") {
            steps {
                sh 'docker version'
                sh "docker build -t kilme/identity-service:${BUILD_ID} ."
                sh "docker image list"
            }
        }

        stage("Push Image to Docker Hub") {
            steps {
                sh 'echo $DOCKER_CREDENTIALS_PSW | docker login -u $DOCKER_CREDENTIALS_USR --password-stdin'
                sh "docker push kilme/identity-service:${BUILD_ID}"
                sh "docker rmi -f kilme/identity-service:${BUILD_ID}"
            }
        }

        stage("SSH Into k8s Server") {
            steps {
                sh 'scp k8s-identity-service.yml cluster@192.168.2.30:/home/cluster'
                sh "ssh cluster@192.168.2.30 'export IMAGE_VERSION=${BUILD_ID} && envsubst < k8s-identity-service.yml | kubectl apply -f -'"
            }
        }
    }
}