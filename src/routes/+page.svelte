<script lang="ts">
	import { walletAddress, walletClient, publicClient } from '$lib/viem';
	import { statusNetworkTestnet } from '$lib/viem';
	import { get } from 'svelte/store';
	
	// Contract address and ABI
	const RAKIA_CONTRACT = '0xf78BD2c08120727370b603Db4c535fe142a6a7B9' as const;
	const rakiaAbi = [
		{
			"inputs": [],
			"name": "drinkRakia",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
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
	
	let shotCount = 0;
	let isDrinking = false;
	let drinkError: string | null = null;
	let isWrongNetwork = false;
	
	// Function to check if user is on the correct network
	async function checkNetwork() {
		const client = get(walletClient);
		if (!client) return;
		
		try {
			const chain = await client.getChainId();
			isWrongNetwork = chain !== statusNetworkTestnet.id;
		} catch (error) {
			console.error('Failed to check network:', error);
		}
	}
	
	// Function to switch to Status Network
	async function switchNetwork() {
		const client = get(walletClient);
		if (!client) return;
		
		try {
			await client.switchChain({ id: statusNetworkTestnet.id });
			isWrongNetwork = false;
		} catch (error) {
			console.error('Failed to switch network:', error);
			drinkError = 'Failed to switch network. Please switch to Status Network manually.';
		}
	}
	
	// Function to add Status Network to wallet
	async function addStatusNetwork() {
		const client = get(walletClient);
		if (!client) return;
		
		try {
			if (typeof window === 'undefined' || !window.ethereum) {
				throw new Error('No Ethereum provider found');
			}
			
			await window.ethereum.request({
				method: 'wallet_addEthereumChain',
				params: [{
					chainId: '0x' + statusNetworkTestnet.id.toString(16),
					chainName: 'Status Network Sepolia',
					nativeCurrency: {
						name: 'ETH',
						symbol: 'ETH',
						decimals: 18
					},
					rpcUrls: ['https://public.sepolia.rpc.status.network'],
					blockExplorerUrls: ['https://sepoliascan.status.network']
				}]
			});
			// After adding, try to switch to it
			await switchNetwork();
		} catch (error) {
			console.error('Failed to add Status Network:', error);
			drinkError = 'Failed to add Status Network. Please add it manually.';
		}
	}
	
	// Function to fetch current shot count
	async function fetchShotCount() {
		if (!$walletAddress) return;
		
		try {
			const shots = await publicClient.readContract({
				address: RAKIA_CONTRACT,
				abi: rakiaAbi,
				functionName: 'shotsTaken',
				args: [$walletAddress]
			});
			shotCount = Number(shots);
		} catch (error) {
			console.error('Failed to fetch shot count:', error);
		}
	}
	
	// Function to take a shot
	async function takeShot() {
		const client = get(walletClient);
		const address = get(walletAddress);
		
		if (!client || !address) {
			drinkError = 'Please connect your wallet first';
			return;
		}
		
		if (isWrongNetwork) {
			drinkError = 'Please switch to Status Network first';
			return;
		}
		
		try {
			isDrinking = true;
			drinkError = null;
			
			const hash = await client.writeContract({
				chain: statusNetworkTestnet,
				account: address,
				address: RAKIA_CONTRACT,
				abi: rakiaAbi,
				functionName: 'drinkRakia'
			});
			
			// Wait for transaction to be mined
			await publicClient.waitForTransactionReceipt({ hash });
			
			// Update shot count
			await fetchShotCount();
		} catch (error) {
			console.error('Failed to drink rakia:', error);
			drinkError = error instanceof Error ? error.message : 'Failed to drink rakia';
		} finally {
			isDrinking = false;
		}
	}
	
	// Check network and fetch initial shot count when wallet is connected
	$: if ($walletAddress) {
		checkNetwork();
		fetchShotCount();
	}
</script>

<div class="min-h-[80vh] flex flex-col items-center px-4 py-8">
	<!-- Title with retro effect -->
	<h1 class="text-4xl sm:text-6xl font-bold mb-8 sm:mb-12 text-center text-white" style="
		text-shadow: 2px 2px 0 #808080,
					 3px 3px 0 #404040,
					 4px 4px 0 #202020;
		font-family: 'Arial Black', sans-serif;
	">
		RAKIJA.pump
	</h1>

	<!-- Win98-style box for shot counter -->
	<div class="w-full max-w-md p-1 bg-[#c0c0c0] shadow-[2px_2px_0_#000000] border-t-2 border-l-2 border-[#ffffff] border-r-2 border-b-2 border-r-[#808080] border-b-[#808080]">
		<div class="bg-[#000080] text-white p-1 font-bold text-sm flex items-center">
			<span class="text-lg mr-1">🥃</span>
			<span class="ml-1">Shots Taken</span>
			<button class="ml-auto text-lg leading-none px-2 hover:bg-red-500">×</button>
		</div>
		<div class="p-4 bg-[#c0c0c0]">
			{#if $walletAddress}
				{#if isWrongNetwork}
					<div class="text-center py-4">
						<p class="mb-4 text-black font-bold">Please switch to Status Network</p>
						<div class="flex flex-col sm:flex-row gap-4 justify-center">
							<button 
								on:click={switchNetwork}
								class="px-6 py-3 bg-[#000080] text-white font-bold rounded shadow-[2px_2px_0_#000000] hover:bg-[#0000a0] transition-colors"
							>
								Switch Network
							</button>
							<button 
								on:click={addStatusNetwork}
								class="px-6 py-3 bg-[#008000] text-white font-bold rounded shadow-[2px_2px_0_#000000] hover:bg-[#00a000] transition-colors"
							>
								Add Status Network
							</button>
						</div>
					</div>
				{:else}
					<div class="text-center mb-4">
						<span class="text-3xl sm:text-5xl font-bold font-mono bg-white text-black px-4 py-2 rounded border-2 border-[#808080] shadow-inner">
							{shotCount}
						</span>
						<p class="mt-4 text-sm text-black font-bold">Total Shots</p>
					</div>
					
					<!-- Take shot button -->
					<button 
						on:click={takeShot}
						disabled={isDrinking}
						class="w-full p-3 sm:p-4 text-lg sm:text-xl font-bold bg-[#c0c0c0] border-t-2 border-l-2 border-[#ffffff] border-r-2 border-b-2 border-r-[#808080] border-b-[#808080] active:border-r-[#ffffff] active:border-b-[#ffffff] active:border-t-[#808080] active:border-l-[#808080] hover:bg-[#d0d0d0] transition-colors text-black disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isDrinking ? 'Drinking...' : '🥃 DRINK!'}
					</button>
					
					{#if drinkError}
						<p class="mt-2 text-red-500 text-sm">{drinkError}</p>
					{/if}
				{/if}
			{:else}
				<div class="text-center py-4">
					<p class="mb-4 text-black font-bold">Connect your wallet to start drinking!</p>
					<span class="text-4xl">💻</span>
				</div>
			{/if}
		</div>
	</div>

	<!-- Win98 start button style footer -->
	<div class="fixed bottom-0 left-0 right-0 h-8 sm:h-10 bg-[#c0c0c0] border-t-2 border-[#ffffff] flex items-center px-2">
		<div class="text-xs sm:text-sm text-black font-bold">
			Press DRINK! to add a shot • Remember to drink responsibly 🍻
		</div>
	</div>
</div>
