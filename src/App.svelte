<script>
	import { onMount } from "svelte";
	let email = "";
  
	const handleLogin = async (googleData) => {
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
  
	const handleLogout = async () => {
	  await fetch("/api/auth", { method: "GET" });
	  email = "";
	};
  
	onMount(() => {
	  // Memuat gapi.js secara dinamis
	  const script = document.createElement("script");
	  script.src = "https://apis.google.com/js/platform.js";
	  script.async = true;
	  script.defer = true;
	  script.onload = () => {
		window.gapi.load("auth2", () => {
		  window.gapi.auth2.init({
			client_id: "464641426916-3c3357ee858024a9ghch47t6dhu4eihj.apps.googleusercontent.com", // Gantilah dengan Client ID Anda
		  });
		});
	  };
	  document.body.appendChild(script);
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
  