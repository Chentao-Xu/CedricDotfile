#!/bin/bash
files="bashrc vimrc zshrc"

for file in $files; do
	ln -s ~/dotfiles/"$file" ~/."$file"
done
