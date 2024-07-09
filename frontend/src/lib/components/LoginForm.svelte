<script>
	import { onMount } from 'svelte';
	import { login } from '$lib/servises/auth';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	let next = $page.url.searchParams.get('next') || '/';

	let username = '';
	let password = '';
	let error = '';
	let submiting = false;

	const handleSubmit = async (event) => {
		event.preventDefault();
		submiting = true;
		error = '';
		try {
			const response = await login(username, password);

			goto(next);
		} catch (err) {
			debugger;
			console.error(err);
			error = err.message;
		}
		submiting = false;
	};

	onMount(() => {});
</script>

<div class="container">
	<form on:submit={handleSubmit}>
		<div class="form-group">
			<label for="username">שם משתמש</label>
			<input type="text" class="form-control" id="username" bind:value={username} />
		</div>
		<div
			class="form-group
    "
		>
			<label for="password">סיסמא</label>
			<input type="password" class="form-control" id="password" bind:value={password} />
		</div>

		<button type="submit" class="btn btn-primary" disabled={submiting}>שלח</button>
		{#if error}
			<div class="alert alert-danger" role="alert">{error}</div>
		{/if}
	</form>
</div>
