<script lang="ts">
	import { walletAddress } from '$lib/viem';
	
	let shotCount = 0; // This will be replaced with actual data later
	let position = 1; // Placeholder position
	
	function takeShot() {
		shotCount++;
		// Here we'll add the actual blockchain interaction later
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
				<div class="text-center mb-4">
					<span class="text-3xl sm:text-5xl font-bold font-mono bg-white text-black px-4 py-2 rounded border-2 border-[#808080] shadow-inner">
						{shotCount}
					</span>
					<p class="mt-4 text-sm text-black font-bold">Total Shots</p>
				</div>
				
				<!-- Take shot button -->
				<button 
					on:click={takeShot}
					class="w-full p-3 sm:p-4 text-lg sm:text-xl font-bold bg-[#c0c0c0] border-t-2 border-l-2 border-[#ffffff] border-r-2 border-b-2 border-r-[#808080] border-b-[#808080] active:border-r-[#ffffff] active:border-b-[#ffffff] active:border-t-[#808080] active:border-l-[#808080] hover:bg-[#d0d0d0] transition-colors text-black"
				>
					🥃 DRINK!
				</button>

				<!-- Position display -->
				<div class="mt-6 text-center">
					<p class="text-sm mb-1 text-black font-bold">Current Rank:</p>
					<span class="text-xl sm:text-2xl font-bold bg-white text-black px-4 py-1 border-2 border-[#808080] shadow-inner">
						#{position}
					</span>
				</div>
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
