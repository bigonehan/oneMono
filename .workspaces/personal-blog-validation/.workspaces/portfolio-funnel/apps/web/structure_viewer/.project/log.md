## default_check
- command: cargo run -- --help
- messages: error: a bin target must be available for `cargo run`

- errors: command=`cargo run -- --help` exit=Some(101) | error: a bin target must be available for `cargo run`

## default_check
- command: cargo run -- --help
- messages: monorepo_root=/home/tree/home/apps/web/structure_viewer
domain_directory=not-found
undefined
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command "astro" not found
 |    Compiling structure_viewer_bootstrap v0.1.0 (/home/tree/home/apps/web/structure_viewer)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.45s
     Running `target/debug/structure_viewer_bootstrap --help`

- errors: command=`cargo run -- --help` exit=Some(254) |    Compiling structure_viewer_bootstrap v0.1.0 (/home/tree/home/apps/web/structure_viewer)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.45s
     Running `target/debug/structure_viewer_bootstrap --help`

## default_check
- command: cargo run -- --help
- messages: structure_viewer_bootstrap
  --help, -h    show help
  (default)     discover monorepo root/domain and run `pnpm astro dev --host`
 |    Compiling structure_viewer_bootstrap v0.1.0 (/home/tree/home/apps/web/structure_viewer)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.32s
     Running `target/debug/structure_viewer_bootstrap --help`

- errors: 
