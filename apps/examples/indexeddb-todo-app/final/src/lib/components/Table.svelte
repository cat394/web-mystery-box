<script lang="ts">
	type Props = {
		dataObjects: Record<string, any>[];
	};

	let { dataObjects }: Props = $props();

	const headers = Object.keys(dataObjects[0]);

	function dataToString(data: unknown): string {
		if (typeof data === 'object') {
			return JSON.stringify(data);
		} else {
			return data ? data.toString() : 'undefined';
		}
	}
</script>

<table>
	<thead class="text-bg-secondary">
		<tr>
			{#each headers as header}
				<th>{header}</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each dataObjects as dataObject}
			<tr>
				{#each headers as header}
					<td class="text-overflow-ellipsis">{dataToString(dataObject[header])}</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<style>
	table {
		width: 100%;
	}
	th {
		color: var(--text-primary);
		background-color: hsl(var(--bg-primary-hsl) / 80%);
	}
	td {
		max-width: 300px;
		min-width: 200px;
	}
</style>
