#!/bin/bash
files="bashrc vimrc zshrc gitconfig"

for file in $files; do
	ln -s ~/dotfiles/"$file" ~/."$file"
done
