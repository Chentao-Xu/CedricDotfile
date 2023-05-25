#!/bin/bash
files="bashrc vimrc zshrc gitconfig tmux.conf.local"

for file in $files; do
	ln -s ~/dotfiles/"$file" ~/."$file"
done
