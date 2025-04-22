<script lang="ts">
	import { walletAddress, publicClient } from '$lib/viem';
	import { statusNetworkTestnet } from '$lib/viem';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	// Contract address and ABI
	const RAKIA_CONTRACT = '0xf78BD2c08120727370b603Db4c535fe142a6a7B9' as const;
	const rakiaAbi = [
		{
			"inputs": [],
			"name": "getAllRakiaEnjoyers",
			"outputs": [
				{
					"internalType": "address[]",
					"name": "",
					"type": "address[]"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"name": "rakiaEnjoyers",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "shotsTaken",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		}
	] as const;

	// Store for leaderboard data
	const leaderboardData = writable<{ address: string; shots: number; isLeader: boolean }[]>([]);
	let isLoading = true;

	// Function to fetch leaderboard data
	async function fetchLeaderboard() {
		try {
			isLoading = true;
			const enjoyers = await publicClient.readContract({
				address: RAKIA_CONTRACT,
				abi: rakiaAbi,
				functionName: 'getAllRakiaEnjoyers'
			});

			const data = await Promise.all(
				enjoyers.map(async (address) => {
					const shots = await publicClient.readContract({
						address: RAKIA_CONTRACT,
						abi: rakiaAbi,
						functionName: 'shotsTaken',
						args: [address]
					});
					return {
						address,
						shots: Number(shots),
						isLeader: false
					};
				})
			);

			// Sort by shots and mark leader
			const sortedData = data.sort((a, b) => b.shots - a.shots);
			if (sortedData.length > 0) {
				sortedData[0].isLeader = true;
			}

			leaderboardData.set(sortedData);
		} catch (error) {
			console.error('Failed to fetch leaderboard:', error);
		} finally {
			isLoading = false;
		}
	}

	onMount(() => {
		fetchLeaderboard();
	});
</script>

<div class="min-h-[80vh] flex flex-col items-center px-4 py-8">
	<!-- Title with retro effect -->
	<h1 class="text-4xl sm:text-6xl font-bold mb-8 sm:mb-12 text-center text-white" style="
		text-shadow: 2px 2px 0 #808080,
					 3px 3px 0 #404040,
					 4px 4px 0 #202020;
		font-family: 'Arial Black', sans-serif;
	">
		Hall of Fame
	</h1>

	<!-- Win98-style leaderboard box -->
	<div class="w-full max-w-2xl p-1 bg-[#c0c0c0] shadow-[2px_2px_0_#000000] border-t-2 border-l-2 border-[#ffffff] border-r-2 border-b-2 border-r-[#808080] border-b-[#808080]">
		<div class="bg-[#000080] text-white p-1 font-bold text-sm flex items-center">
			<span class="text-lg mr-1">🏆</span>
			<span class="ml-1">Top Drinkers</span>
			<button class="ml-auto text-lg leading-none px-2 hover:bg-red-500">×</button>
		</div>
		<div class="p-2 bg-[#c0c0c0]">
			{#if isLoading}
				<div class="p-4 text-center">Loading leaderboard...</div>
			{:else}
				<!-- Table header -->
				<div class="grid grid-cols-4 gap-2 p-2 bg-[#c0c0c0] border border-[#808080] text-sm font-bold text-black">
					<div>Rank</div>
					<div class="col-span-2">Address</div>
					<div class="text-right">Shots</div>
				</div>
				
				<!-- Table body -->
				<div class="mt-1 border border-[#808080] bg-white">
					{#each $leaderboardData as { address, shots, isLeader }, i}
						<div class="grid grid-cols-4 gap-2 p-2 text-sm border-b border-[#808080] last:border-b-0 {isLeader ? 'bg-yellow-100' : i % 2 === 0 ? 'bg-white' : 'bg-[#f0f0f0]'} {address === $walletAddress ? 'font-bold' : ''} text-black">
							<div class="flex items-center gap-1">
								{#if i === 0}
									👑
								{/if}
								#{i + 1}
							</div>
							<div class="col-span-2 font-mono">
								{address.slice(0, 6)}...{address.slice(-4)}
								{#if isLeader}
									<span class="ml-2 text-xs bg-yellow-200 px-1 rounded text-black">LEADER</span>
								{/if}
							</div>
							<div class="text-right font-bold">
								{shots} 🥃
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<!-- Win98 status bar -->
	<div class="fixed bottom-0 left-0 right-0 h-8 sm:h-10 bg-[#c0c0c0] border-t-2 border-[#ffffff] flex items-center justify-between px-2">
		<div class="flex items-center gap-2 text-black">
			<span class="text-lg">📊</span>
			<span class="text-xs sm:text-sm">Tracking {$leaderboardData.length} brave souls</span>
		</div>
		<div class="text-xs sm:text-sm text-black">
			Updated every block 🔄
		</div>
	</div>
</div> 