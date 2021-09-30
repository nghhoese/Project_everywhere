ssh deadsh0t@olympus.r4kt.com <<EOF
rm -rf ~/frontend_test
git clone --single-branch --branch development  git@github.com:Avans-Sok/frontend.git frontend_test
cd ~/frontend_test
cp ~/env-files/.env-frontend-test .env
docker stop frontendtest
docker build -t frontendtest .
docker run --rm -d --network netwerk1 -p 3001:3001 --name frontendtest frontendtest
exit
EOF
