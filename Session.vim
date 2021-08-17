let SessionLoad = 1
let s:so_save = &so | let s:siso_save = &siso | set so=0 siso=0
let v:this_session=expand("<sfile>:p")
silent only
cd ~/projects/mobx-react-router
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
set shortmess=aoO
badd +7 .gitignore
badd +32 src/store.ts
badd +1 src/sync.ts
badd +8 .eslintrc
badd +111 __test__/store.spec.ts
badd +14 __test__/sync.spec.ts
badd +659 node_modules/@types/jest/index.d.ts
badd +1727 yarn.lock
badd +12 __test__/types.spec.js
badd +12 __test__/types-test.tsx
badd +5 src/type.ts
badd +2 src/index.ts
badd +23 README.md
badd +1 __test__/sot
badd +3 node_modules/mobx/dist/api/makeObservable.d.ts
badd +162 node_modules/history/index.d.ts
badd +1 package.json
argglobal
%argdel
$argadd .gitignore
edit src/store.ts
set splitbelow splitright
wincmd _ | wincmd |
vsplit
1wincmd h
wincmd w
wincmd t
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
exe 'vert 1resize ' . ((&columns * 72 + 73) / 146)
exe 'vert 2resize ' . ((&columns * 73 + 73) / 146)
argglobal
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let s:l = 32 - ((15 * winheight(0) + 16) / 32)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
32
normal! 05|
wincmd w
argglobal
if bufexists("README.md") | buffer README.md | else | edit README.md | endif
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let s:l = 13 - ((12 * winheight(0) + 16) / 32)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
13
normal! 0
wincmd w
exe 'vert 1resize ' . ((&columns * 72 + 73) / 146)
exe 'vert 2resize ' . ((&columns * 73 + 73) / 146)
tabnext 1
if exists('s:wipebuf') && getbufvar(s:wipebuf, '&buftype') isnot# 'terminal'
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20 winminheight=1 winminwidth=1 shortmess=filnxtToOFA
let s:sx = expand("<sfile>:p:r")."x.vim"
if file_readable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &so = s:so_save | let &siso = s:siso_save
let g:this_session = v:this_session
let g:this_obsession = v:this_session
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
