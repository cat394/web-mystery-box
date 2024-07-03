<script lang="ts">
	type Props = {
		dataObjects: Record<string, any>[];
	};

	let { dataObjects }: Props = $props();

	const headers = Object.keys(dataObjects[0]);

	function dataToString(data: unknown): string {
    if (data === undefined) {
        return 'undefined';
    } else if (data === null) {
        return 'null';
    } else if (typeof data === 'object') {
        try {
            return JSON.stringify(data);
        } catch (error) {
            return String(data);
        }
    } else {
        return String(data);
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
