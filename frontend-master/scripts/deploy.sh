ssh deadsh0t@olympus.r4kt.com <<EOF
rm -rf ~/frontend
git clone git@github.com:Avans-Sok/frontend.git frontend
cd ~/frontend
cp ~/env-files/.env-frontend-production .env
docker stop frontend
docker build -t frontend .
docker run --rm -d --network netwerk1 -p 3000:3000 --name frontend frontend
exit
EOF
