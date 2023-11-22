local set = vim.o
set.number = true
set.relativenumber = true

set.clipboard = "unnamedplus"
vim.cmd("set tabstop=4")
vim.cmd("set shiftwidth=4")
vim.cmd("set expandtab")
-- set.pumblend = 15

-- Global mappings.
-- See `:help vim.diagnostic.*` for documentation on any of the below functions
vim.keymap.set("n", "<space>e", vim.diagnostic.open_float)
vim.keymap.set("n", "[d", vim.diagnostic.goto_prev)
vim.keymap.set("n", "]d", vim.diagnostic.goto_next)
vim.keymap.set("n", "<space>q", vim.diagnostic.setloclist)

-- highlight after copy
vim.api.nvim_create_autocmd({ "TextYankPost" }, {
	pattern = { "*" },
	callback = function()
		vim.highlight.on_yank({
			timeout = 300,
		})
	end,
})

-- keybindings
local opt = { noremap = true, silent = true }
vim.g.mapleader = " "
vim.keymap.set("n", "<C-l>", "<C-w>l", opt)
vim.keymap.set("n", "<C-h>", "<C-w>h", opt)
vim.keymap.set("n", "<C-j>", "<C-w>j", opt)
vim.keymap.set("n", "<C-k>", "<C-w>k", opt)
vim.keymap.set("n", "<Leader>v", "<C-w>v", opt)
vim.keymap.set("n", "<Leader>s", "<C-w>s", opt)
vim.keymap.set("n", "<Leader>[", "<C-o>", opt)
vim.keymap.set("n", "<Leader>]", "<C-i>", opt)

-- Open NvimTree
vim.api.nvim_set_keymap("n", "<leader>n", ":NvimTreeOpen<CR>", { noremap = true, silent = true })
-- Close NvimTree
vim.api.nvim_set_keymap("n", "<leader>m", ":NvimTreeClose<CR>", { noremap = true, silent = true })

-- https://www.reddit.com/r/vim/comments/2k4cbr/problem_with_gj_and_gk/
-- vim.keymap.set("n", "j", [[v:count ? 'j' : 'gj']], { noremap = true, expr = true })
-- vim.keymap.set("n", "k", [[v:count ? 'k' : 'gk']], { noremap = true, expr = true })

-- lazy.nvim
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not vim.loop.fs_stat(lazypath) then
	vim.fn.system({
		"git",
		"clone",
		"--filter=blob:none",
		"https://github.com/folke/lazy.nvim.git",
		"--branch=stable", -- latest stable release
		lazypath,
	})
end

vim.opt.rtp:prepend(lazypath)

require("lazy").setup("plugins")

-- color scheme
vim.o.background = "light" -- or "light" for light mode
vim.cmd([[colorscheme gruvbox]])

-- vim.cmd.colorscheme("base16-gruvbox-material-dark-medium")

-- lspconfig

-- local lspconfig = require("lspconfig")

-- Set up lspconfig.

-- nvim-cmp

-- lua-line

-- bufferline

-- nvim-tree

-- empty setup using defaults

-- treesitter setup

-- lsp-signature

-- nvim-dap setup

-- dat codicons

-- dap-ui setup
