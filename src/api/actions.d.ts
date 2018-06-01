import { ActionCreator } from "redux"
import { ThunkAction } from "redux-thunk"

interface FetchProps {
  key?: string,
  path?: string,
  replace?: boolean,
  method?: string
  persist?: boolean
}

export function fetch(resourceName: string, options: FetchProps & FetchOptions = {}): ThunkAction
export function create(resourceName: string, record, options: FetchProps & FetchOptions = { persist: true }): ThunkAction
export function update(resourceName: string, record, options: FetchProps & FetchOptions = { persist: true }): ThunkAction
export function destroy(resourceName: string, record, options: FetchProps & FetchOptions = { persist: true }): ThunkAction
export function actionTypesFor(resourceName: string): ActionCreator
export function actionCreatorsFor(resourceName: string): ActionCreator
