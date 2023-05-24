#!/bin/bash
files="bashrc vimrc zshrc config gitconfig oh-my-zsh"

for file in $files; do
	ln -s ~/dotfiles/"$file" ~/."$file"
done
