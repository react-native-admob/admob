---
id: initialize
title: initialize
sidebar_label: initialize
---

Use this function to initialize Mobile Ads SDK. You need to call this function before you load any Ads. Generally, you call this function when the root component of your app is mounted.

## Usage example

```js
import { AdManager } from '@react-native-admob/admob';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await AdManager.initialize();

      setLoading(false);
    };

    init();
  }, []);

  return (/* Your App code */)
```

## Returns

The function returns `Promise<InitializationStatus[]>` which is Promise of each mediation adapter's initialization status.

| Type                                 |
| :----------------------------------- |
| Promise<[InitializationStatus](#)[]> |

Properties of `InitializationStatus`:

| Name        | Type    | Description                   |
| :---------- | :------ | :---------------------------- |
| name        | string  | Name of the adapter.          |
| description | string  | Description of the status.    |
| isReady     | boolean | Whether the adapter is ready. |
