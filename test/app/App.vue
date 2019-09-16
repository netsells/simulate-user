<template>
    <table>
        <tr>
            <td>
                <label for="a">Input</label>
            </td>
            <td>
                <input id="a" v-model="input" />
            </td>
            <td>
                <output>{{ input }}</output>
            </td>
        </tr>

        <tr>
            <td>
                <label for="b">Textarea</label>
            </td>
            <td>
                <textarea id="b" v-model="textarea" />
            </td>
            <td>
                <output>{{ textarea }}</output>
            </td>
        </tr>

        <tr>
            <td>
                <label for="c">Select</label>
            </td>
            <td>
                <select id="c" v-model="select">
                    <option value="">Select something</option>
                    <option value="foo">Foo</option>
                    <option value="bar">Bar</option>
                </select>
            </td>
            <td>
                <output>{{ select }}</output>
            </td>
        </tr>

        <tr>
            <td>
                <label for="d">Checkbox</label>
            </td>
            <td>
                <input id="d" v-model="checkbox" type="checkbox" />
            </td>
            <td>
                <output>{{ checkbox }}</output>
            </td>
        </tr>

        <tr>
            <td>
                <label for="e">File</label>
            </td>
            <td>
                <input id="e" @change="setFile" type="file" />
            </td>
            <td>
                <output>{{ files.map(f => f.name).join(', ') }}</output>
            </td>
        </tr>
    </table>
</template>

<script>
    export default {
        name: 'app',

        data() {
            return {
                input: '',
                textarea: '',
                select: '',
                checkbox: false,
                files: [],
            };
        },

        methods: {
            setFile({ target }) {
                this.files = Array.from(target.files);
            },
        }
    };
</script>
