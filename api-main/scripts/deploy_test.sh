ssh deadsh0t@olympus.r4kt.com <<EOF
rm -rf ~/api_test
git clone --single-branch --branch development  git@github.com:Avans-Sok/api.git api_test
cd ~/api_test
cp ~/env-files/.env-api-test .env
cp ~/env-files/firebase-keys.json config/.
mkdir public
mkdir public/uploads
docker stop testapi
docker build -t testapi .
docker run --rm -d --network netwerk1 -p 5001:5001 --name testapi testapi
exit
EOF
