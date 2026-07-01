pipeline {
    agent any

    tools {
        nodejs 'Node18'
    }

    options {
        timestamps()
        timeout(time: 2, unit: 'HOURS')
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    environment {
        SONAR_HOME = tool "Sonar"
    }

    stages {

        stage("SonarQube Analysis") {
            steps {
                withSonarQubeEnv('Sonar') {
                    sh '$SONAR_HOME/bin/sonar-scanner -Dsonar.projectKey=ReactNodeApp -Dsonar.projectName=ReactNodeApp '
                }
            }
        }


        stage("OWASP Dependency Check") {
            steps {
                dependencyCheck additionalArguments: '--scan ./', odcInstallation: 'dc'
                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
            }
        }

        stage("Sonar Quality Gate Scan") {
            steps {
                timeout(time: 2, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: false
                }
            }
        }

        stage("Trivy Scan"){
            steps{
                sh "trivy fs --format table -o trivy-fs-report.html ."
            }
        }

        stage('Install Dependencies') {
            parallel {
                stage('Backend Dependencies') {
                    steps {
                        dir('backend') {
                            sh 'npm install --no-audit --no-fund'
                        }
                    }
                }
                stage('Frontend Dependencies') {
                    steps {
                        dir('frontend') {
                            sh 'npm install --no-audit --no-fund'
                        }
                    }
                }
            }
        }

        stage('Test') {
            parallel {
                stage('Backend Tests') {
                    steps {
                        dir('backend') {
                            sh 'npm test'
                        }
                    }
                }
                stage('Frontend Tests') {
                    steps {
                        dir('frontend') {
                            sh 'npm test'
                        }
                    }
                }
            }
        }

        stage('Lint Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm run lint'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Trivy Docker Image Scan') {
            steps {
                sh '''
                trivy image --severity HIGH,CRITICAL
                --format table 
                -o backend-trivy-report.txt 
                reactnodeapp-backend:latest

                trivy image --severity HIGH,CRITICAL 
                --format table 
                -o frontend-trivy-report.txt 
                reactnodeapp-frontend:latest
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    docker compose down || true
                    docker compose up -d
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully'
        }

        failure {
            echo 'Pipeline failed'
        }

        always {
            cleanWs()
        }
    }
}
