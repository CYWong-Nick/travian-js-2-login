import { FC, useEffect, useState } from "react";
import { Account, Gameworld } from "./database/DatabaseTypes";
import { db } from "./database/db";
import { useLiveQuery } from "dexie-react-hooks"
import { v4 } from 'uuid'

const newAccountDefault = {
  id: '',
  gameworldId: '',
  username: '',
  password: '',
}

const App: FC = () => {

  useEffect(() => {

    setInterval(async () => {
      const username = document.getElementById('usernameOrEmail')
      const password = document.getElementById('password')

      if (!username || !password) {
        return
      }

      const name = document.querySelector('.worldName')?.innerHTML
      const subtitle = document.querySelector('.subLine')?.innerHTML

      const world = await db.gameworlds.where({
        name: name?.trim(),
        subtitle: subtitle?.trim()
      }).first()

      if (!world) {
        return
      }

      const acc = await db.accounts.where('gameworldId').equals(world.id).first()
      const loginButton = password.parentElement?.parentElement?.querySelector('button')
      if (!acc || !loginButton) {
        return
      }


      //@ts-ignore
      username.value = acc.username
      //@ts-ignore
      password.value = acc.password
      loginButton.click()
    }, 500)

    // Traverse a dom element
    const stores = new Set()

    const traverse = (element: any) => {
      const store = element?.memoizedState?.element?.props?.store || element?.pendingProps?.store || element?.stateNode?.store;

      if (store) {
        stores.add(store);
      }

      if (element.child) {
        traverse(element.child);
      }
    };

    // Find the root element for React
    //@ts-ignore
    const reactRoot = Array.from(document.querySelectorAll("*[id]")).find((el) => el?._reactRootContainer?._internalRoot?.current);

    //@ts-ignore
    const internalRoot = reactRoot._reactRootContainer._internalRoot.current;

    // Traverse the root react element to find all Redux States in the app
    traverse(internalRoot)

    const store = stores.values().next().value
    const gameworlds: Gameworld[] = store.getState().gameworlds
    db.gameworlds.clear()
      .then(() =>
        db.gameworlds.bulkPut(gameworlds.map(e => ({ ...e, id: e.uuid, name: e.name.trim() })))
      )
  }, [])

  const gameworlds = useLiveQuery(() => db.gameworlds.orderBy('name').toArray())
  const accounts = useLiveQuery(() => db.accounts.toArray())

  const [newAccount, setNewAccount] = useState<Account>({ ...newAccountDefault })
  const handleUpdateNewAccount = (key: keyof Account, value: string) => {
    setNewAccount(e => ({
      ...e,
      [key]: value
    }))
  }
  const handleSaveNewAccount = async () => {
    await db.accounts.put({
      ...newAccount,
      id: v4()
    })
    setNewAccount({ ...newAccountDefault })
  }

  const [accountUpdates, setAccountUpdates] = useState<Record<string, Account>>({})
  const handleUpdateAccount = (id: string, key: keyof Account, value: string) => {
    setAccountUpdates(e => ({
      ...e,
      [id]: {
        ...accounts?.find(a => a.id === id),
        ...e[id],
        [key]: value
      }
    }))
  }
  const saveAccountUpdate = async (id: string) => {
    await db.accounts.put(accountUpdates[id])
    setAccountUpdates(e => {
      const newState = { ...e }
      delete newState[id]
      return newState
    })
  }
  const deleteAccount = async (id: string) => {
    await db.accounts.delete(id)
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Gameworld</th>
            <th>Username</th>
            <th>Password</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {accounts?.map(acc => {
            const item = accountUpdates[acc.id] || acc
            return <tr key={acc.id}>
              <td>
                <select value={item.gameworldId} onChange={e => handleUpdateAccount(acc.id, 'gameworldId', e.target.value)}>
                  {gameworlds?.map(gw => <option key={gw.id} value={gw.id}>{gw.name} {gw.subtitle}</option>
                  )}
                </select>
              </td>
              <td>
                <input value={item.username} onChange={e => handleUpdateAccount(acc.id, 'username', e.target.value)} />
              </td>
              <td>
                <input type="password" value={item.password} onChange={e => handleUpdateAccount(acc.id, 'password', e.target.value)} />
              </td>
              <td>
                <button onClick={() => saveAccountUpdate(acc.id)}>Save</button>
                <button onClick={() => deleteAccount(acc.id)}>x</button>
              </td>
            </tr>;
          }
          )}
          <tr>
            <td>
              <select value={newAccount.gameworldId} onChange={e => handleUpdateNewAccount('gameworldId', e.target.value)} >
                {gameworlds?.map(gw =>
                  <option key={gw.id} value={gw.id}>{gw.name} {gw.subtitle}</option>
                )}
              </select>
            </td>
            <td>
              <input value={newAccount.username} onChange={e => handleUpdateNewAccount('username', e.target.value)} />
            </td>
            <td>
              <input type="password" value={newAccount.password} onChange={e => handleUpdateNewAccount('password', e.target.value)} />
            </td>
            <td>
              <button onClick={handleSaveNewAccount}>+</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default App;
