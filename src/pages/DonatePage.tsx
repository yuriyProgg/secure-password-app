import QRCode from 'react-qr-code'
import { Link } from 'react-router'

export const DonatePage = () => {
  return (
    <div>
      <div className='card'>
        <div className='card-img-top d-flex justify-content-center m-2'>
          <QRCode value='https://vk.com/away.php?to=https%3A%2F%2Ft.tb.ru%2Fc2c-qr-choose-bank-v1%2F%2B79952737153%2F100000000004&utf=1' />
        </div>
        <div className='card-body text-center'>
          <h5 className='card-title'>💻Поддержите автора!</h5>
          <p className='card-text'>
            Каждая строчка кода требует времени и кофе ☕. Ваша поддержка — это
            как Merge Request без конфликтов — помогает проекту развиваться
            быстрее!
          </p>
          <Link
            to='https://t.tb.ru/c2c-qr-choose-bank-v1/+79952737153/100000000004'
            target='_blank'
            className='btn btn-primary d-flex align-items-center gap-1 mx-auto'
            style={{ width: 'fit-content' }}
          >
            <i className='bi bi-heart'></i>
            Поддержать
          </Link>
        </div>
      </div>
    </div>
  )
}
