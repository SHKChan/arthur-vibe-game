#!/usr/bin/env node
/* 打包：把上线需要的文件拷到 dist/arthur/。
 * Cloudflare Worker arthur-vibe-game 挂在路由 www.vibe-game.com/arthur*，
 * Worker 收到的是完整路径（/arthur/index.html），所以文件必须放在 dist/arthur/ 下。
 * 新增运行时文件（js、css、图片目录）要加进 FILES。
 */
'use strict';
const fs = require('fs');
const path = require('path');

const SLUG = 'arthur'; // 和 Cloudflare 路由一致，上线后不要改
const FILES = ['index.html'];

const repo = path.join(__dirname, '..');
const out = path.join(repo, 'dist');
fs.rmSync(out, { recursive: true, force: true });
for (const f of FILES) fs.cpSync(path.join(repo, f), path.join(out, SLUG, f), { recursive: true });
console.log('已生成 dist/' + SLUG + '/：' + FILES.join(', '));
