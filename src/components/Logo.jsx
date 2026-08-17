import "./Logo.css";


function W({children}) {
  return <span className='whiteText'>{children}</span>;
}

function B({children}) {
  return <span className='blueText'>{children}</span>;
}

function G({children}) {
  return <span className='greenText'>{children}</span>;
}

function P({children}) {
  return <span className='purpleText'>{children}</span>;
}

function Pk({children}) {
  return <span className='pinkText'>{children}</span>;
}





export function LogoElement() {

  const letterC = [
    '  _____',
    ' / ____',
    '| |    ',
    '| |    ',
    '| |____',
    ' \\_____|', 
  ] 

  const letterY = [
    '__     __',
    '\\ \\   / /',
    ' \\ \\_/ /',
    '  \\   / ',
    '   | |  ',
    '  |_|  ',
  ]


  const letterP = [
    '_____ ',
    '  __ \\',
    '| |__) ',
    '|  ___/',
    '| |    ',
    '|_|    ',
  ]

  const letterE = [
    ' ______',
    '|  ____',
    '| |__  ',
    '|  __| ',
    '| |____',
    '|______',
  ]

  const letterK = [
    ' _  __',
    '| |/ /',
    '| \' / ',
    '|  < ',
    '| . \\',
    '|_|\\_\\',
  ]

  const letter_d = [
    '   _ ',
    '  | |',
    '__| |',
    '/ _` |',
    ' (_| |',
    '__,_|'
  ]

  const letter_e = [
    '',
    '',
    ' ___',
    '/ _ \\',
    '  __/',
    '\\___|'
  ]

  const letter_v = [
    '',
    '',
    '__   __',
    ' \\ / /',
    '\\ V /',
    ' \\_/',
  ]

  
  const logoRows = [];

  for (let row = 0; row < 6 ; row++) {
    // const element = 6;
    
    logoRows.push(<>
      <W>{ letterC[row] }</W>
      <B>{ letterY[row] }</B>
      <G>{ letterP[row] }</G>
      <W>{ letterE[row] }</W>
      <B>{ letterK[row] }</B>
      <P>{ letter_d[row] }</P>
      <Pk>{ letter_e[row] }</Pk>
      <P>{ letter_v[row] }</P>
    </>)
  }


  console.log(logoRows);


  const content = logoRows.map((row, index) => {
    return <span key={index}>{row}<br /></span>;
  })


  return (<div className='logo'>
    <pre className='blur'>{ content }</pre>
    <pre className='clear'>{ content }</pre>
  </div>)
}
  