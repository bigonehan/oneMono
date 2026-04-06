
# goal
- user 정보와 task 정보를 기록하는 table 
- user domain은 monorepo안의 domain 폴더에 생성 
- Port를 생성후 adapter 생성까지 순서대로 진행할것 
- header에 table 메뉴가 보이고 메뉴를 누르면 User와 user와 연관된 task정보 생성 
- gel 관련 table은 package/infra 에서 패키지 생성후 불러올것 

# libraray
- tanstack table
- gel(edge db)
# sequence
- user domain 생성 
- task domain 생성 
- user crud port 생성 
- task crud port 생성
- user adapter 생성후 template에 삽입 
- vitest로 시험 
