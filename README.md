## 서비스 설명

- Open AI의 text-davinci-003를 이용한 프로젝트
- 크게 Blog, Chat, Admin 세 가지로 구성되어 있음
- Open AI API 참고 링크: [Tutorial: Build a Chatbot with React and OpenAI](https://blog.bitsrc.io/tutorial-build-a-chatbot-with-react-and-openai-2c183c50991e)

## 사용 기술

- Frontend: React.js, Next.js, Typescript, Tailwindcss
- Backend: Prisma, Supabase, Next.js API Routes
- Deployment: Vercel

## 메인 페이지 & 블로그 (/)

<table>
  <thead>
    <tr>
      <th style="text-align: center">메인 페이지 (로그인 전)</th>
      <th style="text-align: center">메인 페이지 (로그인 후)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><img src="https://user-images.githubusercontent.com/38210233/233589589-42526cdd-bd6b-4642-90f9-f40b1aa10c55.png" alt="main page"/></td>
      <td><img src="https://user-images.githubusercontent.com/38210233/233589641-d534e382-0f5c-4227-9607-9d093fb6513d.png" alt="list 1" /></td>
    </tr>
  </tbody>
</table>

<table>
  <thead>
    <tr>
      <th style="text-align: center">블로그 에디터</th>
      <th style="text-align: center">블로그 프로필</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><img src="https://user-images.githubusercontent.com/38210233/233589902-81a10149-7eb4-4d56-a0b9-876bd9c48b4a.png" alt="main page"/></td>
      <td><img src="https://user-images.githubusercontent.com/38210233/233589950-bb926d4c-55c1-41bd-a71c-bd106c9d25a1.png" alt="list 1" /></td>
    </tr>
  </tbody>
</table>

## 어드민 (/admin)

<table>
  <thead>
    <tr>
      <th style="text-align: center">어드민 메인페이지</th>
      <th style="text-align: center">어드민 리스트</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><img src="https://user-images.githubusercontent.com/38210233/233590181-9a5b5dbb-434d-4036-a9dd-07782471a2d1.png" alt="main page"/></td>
      <td><img src="https://user-images.githubusercontent.com/38210233/233590341-b597fde5-f5b0-4a40-8451-2ace5d9eaf85.png" alt="list 1" /></td>
    </tr>
  </tbody>
</table>

<table>
  <thead>
    <tr>
      <th style="text-align: center">어드민 폼</th>
      <th style="text-align: center">어드민 상세</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><img src="https://user-images.githubusercontent.com/38210233/233590432-7dda4b39-20db-4686-b8ce-a2bc3d10c2d1.png" alt="main page"/></td>
      <td><img src="https://user-images.githubusercontent.com/38210233/233590491-e0ff8a88-289b-4cec-b1e1-f166f0813cff.png" alt="list 1" /></td>
    </tr>
  </tbody>
</table>

## 채팅 (/chats)

<table>
  <thead>
    <tr>
      <th style="text-align: center">채팅 기본</th>
      <th style="text-align: center">채팅 리스트</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><img src="https://user-images.githubusercontent.com/38210233/233590696-40c9313f-480a-45be-ab31-401253ea0c42.png" alt="main page"/></td>
      <td><img src="https://user-images.githubusercontent.com/38210233/233590744-8d294391-d42f-4a67-817f-d237d44eb872.png" alt="list 1" /></td>
    </tr>
  </tbody>
</table>

---

## 구현 기능

- [x] 전체: tailwind 세팅, 레이아웃 작업
- [x] blog: react-quill 적용
- [x] blog: react-quill codeblock 적용
- [x] blog: prisma, supabase db 연결
- [x] blog: 에디터로 post 생성하기
- [x] blog: next-auth 구글 로그인
- [x] blog: next-auth 구글 로그인 후 데이터 저장
- [x] blog: profile 페이지 작업
- [x] blog: AI create blog post 버튼 추가
- [x] blog: get membership 배너 cookie 작업 (24시간)
- [x] blog: 랜딩 페이지 작업
- [x] blog: 게시글 수정 - 작업중 (editor 간헐적으로 내용 뜨지 않는 문제)
- [x] blog: 게시글 삭제
- [x] blog: FREE 멤버십 API 호출 월 10회 제한
- [ ] blog: AI continue writing 버튼 기능 추가
- [ ] blog: AI enhancement 버튼 추가
- [ ] blog: blog: AI summarize 버튼 추가
- [x] blog: infinite scroll 추가
- [ ] blog: 사이드 바 구성 (recent, recommendation)
- [ ] blog: 유료 멤버십 request access 페이지 작업
- [x] blog: amplitude 세팅
- [ ] blog: 공개 url 작업
- [ ] blog: sns 공유 작업
- [ ] blog: 전체 복사 작업
- [ ] blog: 검색창 작업
- [ ] blog: 임시저장 작업
- [ ] blog: 헤더 드롭 다운 항목 추가 (이미지 사진 -> profile, logout)
- [ ] blog: 댓글 기능
- [ ] blog: 좋아요 기능
- [ ] blog: 조회수 기능
- [x] admin: 기본 CRUD 작업
- [x] admin: 레이아웃 작업
- [x] admin: pagination 작업
- [x] admin: relations 업데이트 작업
- [x] admin: relations 보여주기 작업
- [ ] admin: amplitude 세팅
- [ ] admin: 이미지 업로드 작업 (단일)
- [ ] admin: 이미지 업로드 작업 (다중)
- [x] chat: 레이아웃 작업
- [x] chat: 모바일 반응형 작업
- [x] chat: api 작업
- [x] chat: gpt 연동 작업
- [ ] chat: 실시간 스트리밍
- [ ] chat: regenerate 작업
- [ ] chat: clear all 작업
