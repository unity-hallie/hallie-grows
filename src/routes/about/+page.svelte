<script lang="ts">
  let { data } = $props();

  let blocks = $state<string[]>([]);

  $effect(() => {
    blocks = (data.content as Record<string, string[]>)['about'] ?? ['tktktk', 'tktktk', 'tktktk'];
  });

  async function save() {
    await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'about', blocks: [...blocks] }),
    });
  }

  function onblur(e: FocusEvent, i: number) {
    const text = (e.currentTarget as HTMLElement).innerText.trim();
    if (text !== blocks[i]) {
      blocks[i] = text;
      save();
    }
  }
</script>

<svelte:head>
  <title>about — hallie larsson</title>
</svelte:head>

<section class="about" aria-labelledby="page-heading">
  <h1 id="page-heading" class="page-heading">about</h1>

  <div class="bio">
    {#each blocks as block, i}
      <p
        class="tktk"
        class:filled={block !== 'tktktk'}
        contenteditable="true"
        spellcheck="false"
        onblur={(e) => onblur(e, i)}
      >{block}</p>
    {/each}
  </div>

  <div class="contact">
    <p class="label">elsewhere</p>
    <ul role="list">
      <li><span class="tktk" contenteditable="true" spellcheck="false">tktktk</span></li>
    </ul>
  </div>
</section>

<style>
  .about {
    max-width: 52rem;
  }

  .page-heading {
    font-size: var(--size-2xl);
    margin-bottom: var(--space-12);
  }

  .bio {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
    margin-bottom: var(--space-16);
  }

  .bio p {
    font-size: var(--size-lg);
    color: var(--text-secondary);
    line-height: var(--leading-loose);
    font-style: italic;
  }

  .contact .label {
    font-family: var(--font-ui);
    font-size: var(--size-xs);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-dim);
    margin-bottom: var(--space-4);
  }

  .contact ul {
    list-style: none;
    display: flex;
    gap: var(--space-6);
  }

  .contact a {
    font-family: var(--font-ui);
    font-size: var(--size-sm);
    letter-spacing: 0.04em;
    color: var(--text-secondary);
  }

  .contact a:hover {
    color: var(--rose);
  }

  .tktk {
    border-bottom: 1px dashed var(--lichen-dim);
    color: var(--lichen-dim);
    cursor: text;
    outline: none;
  }

  .tktk:focus {
    border-bottom-color: var(--lichen);
    color: var(--text-secondary);
  }

  .tktk.filled {
    border-bottom-color: transparent;
    color: var(--text-secondary);
  }

  .tktk.filled:focus {
    border-bottom-color: var(--lichen-dim);
  }
</style>
