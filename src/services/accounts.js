const accountStyle = (acc) => {
  const styles = {
    'padding-left': '3px',
    'border-left': `4px solid ${acc.color}`
  }
  let str = ''

  for (const k in styles) {
    str += `${k}: ${styles[k]};`
  }

  return str
}

const AccountsService = {
  accountStyle,
}

export {
  AccountService,
  accountStyle,
}
