## 서비스 설명

- DeeplAI 및 Clova Chat AI를 이용한 프로젝트
- 크게 Blog, Chat, Admin 세 가지로 구성되어 있음
- Deepl API Docs: [Learn more about the DeepL API's capabilities and common use cases.](https://developers.deepl.com/docs)
- Clova Chatbot API Docs: [CLOVA Chatbot 개요](https://api.ncloud-docs.com/docs/ai-application-service-chatbot)

## 사용 기술

- Frontend: React.js, Next.js, Typescript, Tailwindcss
- Backend: Prisma, Supabase, Next.js API Routes
- Deployment: Vercel
- AI: Deeplai API, Clova Chabot AI API

## 주요 기능 설명

### 1. DeeplAI 적용

- DeeplAI API는 고급 번역 서비스로, 사용자가 입력한 텍스트를 다양한 언어로 번역할 수 있는 기능을 제공합니다.
- DeeplAI를 활용하여 블로그 포스트 작성 시 (한->영, 영->한) 다국어 지원을 제공하며, 사용자는 번역된 텍스트를 블로그에 쉽게 게시할 수 있습니다.
- 문서의 번역 품질이 높아 사용자가 작성한 콘텐츠의 국제화가 용이하며, 다양한 언어로 독자에게 도달할 수 있습니다.

### 2. Clova Chat AI 적용

- Clova Chatbot API는 사용자와의 대화 기능을 제공하며, 주로 채팅 모듈에서 사용됩니다.
- 사용자가 채팅을 시작하면 Clova Chatbot이 입력된 질문을 처리하고, 해당 질문에 적절한 답변을 제공합니다.
- 주로 'Bloggy' 사용 방법에 대한 내용을 트레이닝 하였으며 예시 질문을 통해 질문을 시작할 수 있습니다.
- 예를 들어, 사용자가 "How do I start a new chat on Bloggy?"와 같은 질문을 하면, Clova Chatbot이 해당 질문을 분석하여 등록된 답변을 기반으로 Bloggy 챗봇 실행 방식을 설명합니다.
- Chatbot은 사용자가 여러 번 질문해도 일관된 답변을 제공하도록 설계되어 있습니다.
- Chatbot은 네이버 클라우드 콘솔을 통해 데이터셋을 빌드하고, 채팅 통계를 확인하고 있습니다.

### 3. 어드민 기능 (/admin)

- 어드민 메인페이지: 어드민 화면에서는 전체 블로그와 사용자의 활동을 관리할 수 있습니다. 사용자는 어드민 페이지에서 콘텐츠를 생성, 수정, 삭제할 수 있습니다.
- 어드민 리스트: 관리자가 현재 블로그 포스트와 사용자 리스트를 확인할 수 있으며, 필요한 경우 수정 작업을 수행할 수 있습니다.
- 어드민 폼: 새로운 콘텐츠나 사용자를 추가하는 폼이 제공되며, 각 입력 필드를 통해 정보를 입력하여 쉽게 데이터베이스에 추가할 수 있습니다.
- 어드민 상세: 특정 사용자의 활동 내역이나 블로그의 세부 정보를 확인할 수 있는 화면입니다.

### 4. 메인 페이지 & 블로그 (/)

- 로그인 전 메인 페이지: 사용자는 로그인을 하지 않은 상태에서도 블로그를 탐색할 수 있으며, 기본적인 정보만 볼 수 있습니다.
- 로그인 후 메인 페이지: 로그인을 하면 사용자 맞춤형 경험을 제공하며, 사용자가 작성한 블로그 포스트를 편집하거나 삭제할 수 있습니다.
- 블로그 에디터: 사용자가 블로그 포스트를 작성하거나 수정할 수 있는 기능을 제공하며, DeeplAI를 사용해 여러 언어로 번역된 버전을 쉽게 작성할 수 있습니다.
- 블로그 프로필: 사용자는 자신의 프로필을 관리하고, 게시한 블로그 목록을 볼 수 있습니다.

### 5. 채팅 기능 (/chats)

- 채팅 기본: 사용자는 이 페이지에서 새로운 채팅을 시작할 수 있습니다. Clova Chat AI가 사용자의 질문에 대해 실시간으로 답변을 제공하며, 이전 대화를 기억하고 대화 흐름을 유지합니다.
- 채팅 리스트: 이전 대화 내역을 쉽게 확인할 수 있으며, 각 채팅을 클릭하여 이전 대화를 다시 볼 수 있습니다.

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
      <td><img src="https://github.com/user-attachments/assets/5dc22131-95a3-4bb1-b904-d1b12c698c54" alt="main page"/></td>
      <td><img src="https://github.com/user-attachments/assets/4b5e7878-cc56-4dd9-8a7f-57140bc89e5e" alt="list 1" /></td>
    </tr>
  </tbody>
</table>

## Clova AI 트레이닝 예시

<table>
  <thead>
    <tr>
      <th style="text-align: center">대화 빌드 내역</th>
      <th style="text-align: center">대화 통계 내역</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><img src="https://github.com/user-attachments/assets/d051372f-fd84-41d2-9e07-47a5bbb57683" alt="clova build page"/></td>
      <td><img src="https://github.com/user-attachments/assets/0b29e470-af1a-4aca-9a58-72144b6f40dd" alt="list 1" /></td>
    </tr>
  </tbody>
</table>
