module.exports = {
  apps: [{
    name: 'smkn1kras.sch.id',
    script: 'server.js',
    instances: 'max',       // Pakai semua CPU core
    exec_mode: 'cluster',   // Cluster mode untuk multi-core
    autorestart: true,
    watch: false,
    max_memory_restart: '400M',
    env: {
      NODE_ENV: 'development',
      PORT: 3000,
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
      HOST: '127.0.0.1',
      COOKIE_SECURE: 'true'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    time: true,
    // Graceful reload
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 10000
  }]
};
