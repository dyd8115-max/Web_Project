# 🐾 PawLog - 반려동물 SNS 플랫폼

반려동물을 키우는 사용자들이 일상을 공유하고 소통할 수 있는 SNS 플랫폼입니다.

## 주요 기능

- 회원가입 / 로그인 (JWT 인증)
- 게시물 CRUD (이미지 + 텍스트 + 해시태그)
- 좋아요 / 댓글 / 팔로우·언팔로우
- 팔로잉 피드 / 전체 피드 (페이지네이션)
- 사용자 검색
- 반려동물 프로필 관리

## 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | React 18 + Vite, Zustand, Axios, Tailwind CSS |
| Backend | Spring Boot 3.2, Spring Security, JPA |
| DB | MySQL 8.0 (dev: H2 in-memory) |
| 인증 | JWT (Access + Refresh Token) |
| 인프라 | Docker, Nginx, GitHub Actions |

## Web Storage 사용

- `localStorage`: Refresh Token 저장 (브라우저 재시작 후 자동 로그인)
- `메모리 (Zustand)`: Access Token, 현재 유저 정보 (보안상 JS 메모리에만 유지)
- Silent Refresh 패턴 적용 (Access Token 15분, Refresh Token 7일)

## 아키텍처

```
[ Browser (React + Vite) ]
        ↕ HTTP :80
[ Nginx Reverse Proxy ]
   ↙              ↘
[ Frontend ]  [ Backend (Spring Boot) ]
[ :80 ]       [ :8080 / JWT / JPA ]
                    ↕
              [ MySQL 8.0 :3306 ]
```

## 로컬 실행

### Docker Compose (권장)

```bash
docker compose up --build
```

http://localhost 에서 접속

### 개별 실행

**Backend:**
```bash
cd backend
mvn spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## API 문서

서버 실행 후 http://localhost/swagger-ui.html

## CI/CD

GitHub Actions를 통해 main 브랜치 push 시:
1. Backend 테스트 (Maven)
2. Frontend 빌드 (Vite)
3. Docker 이미지 빌드 검증
