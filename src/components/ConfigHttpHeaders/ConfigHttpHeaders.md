```js
const [headers, setHeaders] = React.useState({});
<>
  <ConfigHttpHeaders
    value={headers}
    onChange={(evt, value) => setHeaders(value)}
  />
  <div
    style={{
      border: '1px solid #888',
      background: '#eee',
      borderRadius: 4,
      padding: '5px 10px',
      marginTop: 20,
    }}
  >
    <button onClick={() => setHeaders({})}>reset</button>
    <pre>{JSON.stringify(headers, null, 2)}</pre>
  </div>
</>;
```

With initial value:

```js
const [headers, setHeaders] = React.useState({
  foo: 123,
  aa: 'xxx',
});
<>
  <ConfigHttpHeaders
    value={headers}
    onChange={(evt, value) => setHeaders(value)}
  />
  <div
    style={{
      border: '1px solid #888',
      background: '#eee',
      borderRadius: 4,
      padding: '5px 10px',
      marginTop: 20,
    }}
  >
    <button onClick={() => setHeaders({})}>reset</button>
    <pre>{JSON.stringify(headers, null, 2)}</pre>
  </div>
</>;
```
