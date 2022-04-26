node {
    stage('Git pull') {
        git 'https://github.com/rajatpachare/retech.git'
    }
    stage('Copy Code to Kube-Server')
    {
        sh 'rsync -avrh * root@34.212.228.180:/root/retech'
    }
    stage('Deployment on Kube')
    {
       sh 'ssh root@34.212.228.180 ./kube.sh' 
    }
}
