<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import WalletConnect from '$lib/components/WalletConnect.svelte';
	import { onMount } from 'svelte';
	import { initializeWallet, isWalletInitialized } from '$lib/onboardToViem';
	import { page } from '$app/stores';
	import '../app.css';
	
	// Initialize wallet connection on app load
	onMount(() => {
		if (!$isWalletInitialized) {
			initializeWallet();
		}
	});

	let showStartMenu = false;

	function toggleStartMenu() {
		showStartMenu = !showStartMenu;
	}
</script>

<ParaglideJS {i18n}>
	<div class="min-h-screen flex flex-col bg-[#2b2b2b]">
		<!-- Win98 style taskbar -->
		<header class="fixed top-0 left-0 right-0 h-12 bg-[#c0c0c0] border-t-2 border-l-2 border-[#ffffff] border-r-2 border-b-2 border-r-[#808080] border-b-[#808080] z-50 flex items-center px-1 gap-1">
			<!-- Navigation items styled as task buttons -->
			<a 
				href="/" 
				class="h-8 px-3 bg-[#c0c0c0] border-t-2 border-l-2 border-[#ffffff] border-r-2 border-b-2 border-r-[#808080] border-b-[#808080] flex items-center gap-2 hover:bg-[#d0d0d0] {$page.url.pathname === '/' ? 'border-r-[#ffffff] border-b-[#ffffff] border-t-[#808080] border-l-[#808080] bg-[#d0d0d0]' : ''}"
			>
				<span class="text-xl">🥃</span>
				<span class="hidden sm:inline">Take a Shot</span>
				<span class="sm:hidden">Shot</span>
			</a>
			<a 
				href="/leaderboard" 
				class="h-8 px-3 bg-[#c0c0c0] border-t-2 border-l-2 border-[#ffffff] border-r-2 border-b-2 border-r-[#808080] border-b-[#808080] flex items-center gap-2 hover:bg-[#d0d0d0] {$page.url.pathname === '/leaderboard' ? 'border-r-[#ffffff] border-b-[#ffffff] border-t-[#808080] border-l-[#808080] bg-[#d0d0d0]' : ''}"
			>
				<span class="text-xl">🏆</span>
				<span class="hidden sm:inline">Hall of Fame</span>
				<span class="sm:hidden">Fame</span>
			</a>

			<!-- Right side with wallet connect -->
			<div class="ml-auto">
				<WalletConnect />
			</div>
		</header>

		<main class="flex-1 container mx-auto px-4 mt-16">
			<slot />
		</main>
	</div>
</ParaglideJS>

<style>
	:global(body) {
		background-color: #2b2b2b;
		color: #ffffff;
	}
</style>
