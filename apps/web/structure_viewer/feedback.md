# 결과
- runner: Rust
- detected command: cargo run -- --help
- steps: cargo run -- --help
- captures: /home/tree/home/apps/web/structure_viewer/terminal-capture.txt, /home/tree/home/apps/web/structure_viewer/rect-capture.png, /home/tree/home/apps/web/structure_viewer/screen-capture.png

# 체크리스트
- [ ] cargo run -- --help -> error: a bin target must be available for `cargo run` : 바이너리 타깃이 없어 초기 빌드 검증(help 실행)이 실패함

# 미해결
- command=`cargo run -- --help` exit=Some(101)
- error: a bin target must be available for `cargo run`

- a bin target must be available for `cargo run` : 바이너리 타깃이 없어 초기 빌드 검증(help 실행)이 실패함

# 보완
- feedback를 기준으로 plan/drafts 절차를 갱신해야 한다.
- Rust CLI 바이너리를 추가해 `cargo run -- --help`를 통과시키고, CLI가 discovery와 웹서버 실행 경로를 실제로 호출하도록 연결해야 한다.
