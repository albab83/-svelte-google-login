<script>
	import { onMount } from "svelte";
	let email = "";
	
	// Fungsi untuk meng-handle login dengan Google
	const handleLogin = async (googleData) => {
	  // Kirim idToken ke API backend
	  const response = await fetch("/api/auth", {
		method: "POST",
		headers: {
		  "Content-Type": "application/json",
		},
		body: JSON.stringify({ idToken: googleData.tokenId }),
	  });
	  const data = await response.json();
	  if (data.message === "Login berhasil") {
		email = googleData.profileObj.email;
	  }
	};
  
	// Fungsi untuk logout
	const handleLogout = async () => {
	  // Logout: hapus session dan token
	  await fetch("/api/auth", { method: "GET" });
	  email = "";
	};
  
	// Pastikan Google API hanya dimuat setelah window tersedia
	onMount(() => {
	  if (typeof window !== 'undefined' && window.gapi) {
		window.gapi.load("auth2", () => {
		  window.gapi.auth2.init({
			client_id: "464641426916-3c3357ee858024a9ghch47t6dhu4eihj.apps.googleusercontent.com", // Masukkan Client ID di sini
		  });
		});
	  } else {
		console.error("gapi is not available.");
	  }
	});
</script>
  
<main>
	{#if email}
	  <h1>Welcome, {email}</h1>
	  <button on:click={handleLogout}>Logout</button>
	{:else}
	  <div id="google-signin" class="g-signin2" data-onsuccess={handleLogin}></div>
	{/if}
</main>
  
<style>
	/* Styling untuk tombol Google Login */
	.g-signin2 {
	  margin: 20px;
	}
</style>
