ssh deadsh0t@olympus.r4kt.com <<EOF
rm -rf ~/api
git clone git@github.com:Avans-Sok/api.git api
cd ~/api
cp ~/env-files/.env-api-production .env
cp ~/env-files/firebase-keys.json config/.
docker stop api
docker build -t api .
docker run --rm -d --network netwerk1 -p 5000:5000 --name api api
exit
EOF
