<script>
	import { isAuthenticated, logout, me } from '$lib/servises/auth';
</script>

<nav class="navbar navbar-expand-lg navbar-light bg-light">
	<!-- logo, home button, screens button, playlists button -->
	<a class="navbar-brand" href="/">
		<img src="logo.png" width="30" height="30" class="d-inline-block align-top" alt="" />
	</a>
	<button
		class="navbar-toggler"
		type="button"
		data-toggle="collapse"
		data-target="#navbarNav"
		aria-controls="navbarNav"
		aria-expanded="false"
		aria-label="Toggle navigation"
	>
		<span class="navbar-toggler-icon"></span>
	</button>
	<div class="collapse navbar-collapse" id="navbarNav">
		<ul class="navbar-nav mr-auto">
			<li class="nav-item">
				<a class="nav-link" href="/screens">מסכים</a>
			</li>
			<li class="nav-item">
				<a class="nav-link" href="/playlists">רשימות תוכן</a>
			</li>
		</ul>
		<ul class="navbar-nav ml-auto">
			{#if $isAuthenticated}
				<li class="nav-item-text">
					<div class="nav-link" href="">
						שלום,
						{$me?.username}
					</div>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="" on:click={logout}>התנתק</a>
				</li>
			{:else}
				<li class="nav-item">
					<a class="nav-link" href="/login">התחבר</a>
				</li>
			{/if}
		</ul>
	</div>
</nav>
