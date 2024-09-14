import * as NodeCrypto from "crypto"; // Node.js의 `crypto` 모듈을 별칭으로 임포트

// 암호화 관련 함수 작성 시 네임스페이스 사용
export function makeSignature(secretKey: string, message: string): string {
  return NodeCrypto.createHmac("sha256", secretKey) // NodeCrypto로 변경하여 충돌 회피
    .update(message)
    .digest("base64");
}
