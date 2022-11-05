import {Button as NativeButton, IButtonProps} from 'native-base'
import { ReactNode } from 'react'

interface Props extends IButtonProps{
  children: ReactNode
  type?: 'PRIMARY' |'SECONDARY'
}

export function Button({children,type = "PRIMARY", ...rest}:Props){
  return (
    <NativeButton
      w="full"
      h={14}
      rounded="sm"
      bg={type === 'SECONDARY' ? 'red.500' : 'yellow.500'}
      _pressed={{
        bg:type === 'SECONDARY' ? 'red.600' : 'yellow.600'
      }}
      _loading= {{
        _spinner: {color: 'back'}
      }}
      {...rest}
    >
      {children}
    </NativeButton>
  )
}