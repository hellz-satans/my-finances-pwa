<template>
  <section class="import-export m-4">
    <article class="card">
      <header>
        <h2>Import</h2>
      </header>

      <section>
        <p>Select an exported file and import it</p>
        <input
          ref="importFile"
          name="importFile"
          type="file"
          accept="*"
          @change="handleFile"
        />
      </section>

      <footer class="text-white justify-center bg-green-500 border border-green-600">
        <button
          type="button"
          @click.prevent.stop="readData"
        >
          <fa :icon="[ 'fas', 'upload' ]" />
          Upload
        </button>
      </footer>
    </article>

    <article class="card">
      <header class="card-header">
        <h2>Export</h2>
      </header>

      <section class="card-body">
        <ul>
          <li>Accounts</li>
          <li>Expenses</li>
        </ul>

        <details>
          <summary>
            If you're having trouble exporting as <code>.json</code>, export
            the data as a <code>.txt</code> file, it will still be in JSON
            format, just diferent extension.
          </summary>
          <p>
            Some mobile browsers will not let you download <code>.json</code>
            files for security reasons.
          </p>
        </details>
      </section>

      <footer class="justify-center text-white bg-blue-500 border border-blue-600">
        <button
          type="button"
          @click.prevent.stop="exportData()"
          class="mr-4"
        >
          <fa :icon="['fas', 'download' ]" />
          As .json
        </button>

        <button
          type="button"
          @click.prevent.stop="exportData('txt')"
        >
          <fa :icon="['fas', 'download' ]" />
          As .txt
        </button>
      </footer>
    </article>

    <article class="card">
      <header>
        <h2>Seed</h2>
      </header>

      <section>
        <p>Seed test data to see how it works</p>
      </section>

      <footer class="justify-center text-white bg-yellow-500 border border-yellow-600">
        <button
          type="button"
          @click.prevent.stop="seedData"
        >
          <fa :icon="[ 'fas', 'cogs' ]" />
          Seed
        </button>
      </footer>
    </article>

    <article class="card">
      <header>
        <h2>Destroy</h2>
      </header>

      <section>
        <p>
          Destroy <strong>all</strong> local data
          &mdash; export first if unsure
        </p>
      </section>

      <footer class="justify-center text-white bg-red-500 border border-red-600">
        <button
          type="button"
          @click.prevent.stop="deleteData"
        >
          <fa :icon="[ 'fas', 'trash' ]" />
          Destroy
        </button>
      </footer>
    </article>
  </section>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  methods: {
    ... mapActions([ 'deleteData', 'exportData', 'importData', 'seedData' ]),
    handleFile() {
      if (this.$refs.importFile.files.length > 0) {
        this.readData()
      }
    },

    // TODO: make sure it's (at least) a text file and contains a JSON
    readData() {
      if (this.$refs.importFile.files.length > 0) {
        const reader = new FileReader()

          reader.addEventListener('load', (ev) => {
            const data = JSON.parse(ev.target.result)
              this.importData(data)
          })

        reader.readAsBinaryString(this.$refs.importFile.files.item(0))
      }
    },
  }
}
</script>
