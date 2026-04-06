import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Photographer",
    quote: "I was looking for exactly this. Thank you for making it so intuitive and beautifully designed. Highly recommended!",
    rating: 5,
    image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIALcAwwMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAAEAAIDBQYBBwj/xAA7EAACAQMDAQYDBgYBAwUAAAABAgMABBEFEiExBhMiQVFhMnGBFCNSkaGxBzNCYsHw4RZD0RUlU4Lx/8QAGgEAAgMBAQAAAAAAAAAAAAAAAQIAAwQFBv/EACYRAAICAgICAQMFAAAAAAAAAAABAhEDIRIxBFFBEyJhBSMyNHH/2gAMAwEAAhEDEQA/AB8VJFD3nJ+GnQQ95yfhFFbcDA6CqpTNEYjMYGB0FN21JiltpBkR7aRXHNSEADmoHkycDpRQHoRbNdXxHFNQEttXoaOt7dV5b4quiitsbBAvV+lGKuOnSu7cc1Dc3cFuubmZIk9XbApxSY8CmY3c1U/9TaKr7ft8J+R4/OjLTWdMuTiC8gY9MCQUrZEgkrTGFTNjqCCD6GomFJYaIWqIipmB6+VDSzBPhGTURBNhRk0O8rMdsQyaekMk5zKNq+lFLEEHhGBViQLA47PJ3zNu/tonbtGBwKex86heTPA60egDXOBmhnlLnAqUo7ctXdoUYFK5EoGEHmx+lOwoGFGBUhppB+lLYRlKu4SlQIXewKu0dB0qNkowxjyphTFZVI1UCbKbIUiXc9SXNwluuTyx6CqmSUyNk+dWJCN0SST9437V2JCze1MhhLnHlR8UYHAq6KK3IkhhCDiik5NKGLIqcIEUu52qoySelNdC1Zl+2HaMaJbrDbhXvZs7FYZCr+I/+K8vvLy5vZ2kvZpJWPm5zj/iidf1A6tq9zeZyjuRGPRBwP0/eq/bjGQCKddCMQYHoOB+tPicqSVGTRUNnIyhmQhfeioLVN3A3UrmkNGEmF6X2h1CyT7ly6+cMjZB+XpW/wBF1m31ayFzENrAfeI3VTVR2W0K3unBlTnjFEXHZ+Xsr2mtSh3WF+WVP7WwTg/v9KqU1J0WSxOCtstyZZyBECq/iNPjtkQZIy3rRZAAAAwPIVG1XJUVdkbH2xUbmpCM00jFBy+CUQlSxz5VwqByKe1MbAGScCksNDGOajbHU02SVc4QbjTBDLKdz8DpipVhONKM4UZNJYpZfjbaPSiEhRBwMV13VRT8QWRd1COCKVMNyuaVTQA2PUXQY35FK51UrEdq4b1ouTTopRkcNQFzo02CUYN7Vn4o0bKeW9LNuY5Jou1HeYag73T7iIjfAw98VaaVayzRgKhAB5YimVISmwuKMkhRVlb2u3GetEWlqsQG0eLzNWccEYXOcmo510RRAlgIGTVF24vGsuz84hBM8+IYwOpLcf8AmtUyZxXnX8Q9UEOradZq+1xul3fgPIU/vSKTlIeqR5y0EllNi4gKnp4/960ZpNr3k3ftCZ16gbsfvVu88d3ew2CRtJHCPhZsktkE1odJ7Pu2nt3QAc+LGP0q36joVYVemUF5HcSWsk32QKka54nXp6AVJpOlR3YDW0t3HPno6LImfc8EfkaLsNOuf/Vra3lbbDJOscm7+kFgDR/aLSZezErMLnxSg4UpuLDpg8jz/bqKVU+wzkoy4vs0/ZCGRIpFuIwtxA/dyR5wQeucHkfWiu0t5pWotbWy3URvbS5WQxFvFwCDj86wnZu9v9U1K6upblo7lYpJXl25BwBgEeYHJ46eXWj7C7s5FEk9xp1vcI29llQqw6f1F+vr6Uig+dl0pJwp9mjIzTcYoO01i1u7g2qzxNcBd4EModWHmykenpxRbnaOfKr5NtmRdDWNRyEDknApj3AziNcn1qMQvIfvzweQKCVhGvMCdsY3n0pn2eWQ/ecD0osRhB4RgUx5KdIFjFhRBwMU2RlWuM5PSoWUjrR5JAOPMTwvSoGBbk1K/hGaGknHzNJ2ShbKVQd+/wD8VKpRA62125TAkAdRVraa9bSuFdGUnjFZ2G3kmcJEMsa0+k6JHb4llG+TyB6Cr8scaLIuTLXwtGDjIbpkVLGO7TYEAHsKlUADDdaRx5Vmocj2Z+FtvtTSZU9fpUoK58Q+tMF5bl9vegH0NT6dgY03LAeJiD714f21vWu+093cbsGNwkfHQLxXudwYu4dyQQFzxXzteOZryeQ/1SE0YQplWRl1perWiSwn7Kwvdw2ygZHv5+YOOhx5V6v2am3QGQL4a8NslBvrceZkUfrXq2naubOJ7M0uT7WW4m5WH6pbxvdtIRjd1xUGszW/2B2upjJcpEUgDeIA44ycdMmnNOl2ApOGJ4Ipup2sygQWumNcWuBvnWTMhbzwPTpWdbZqdaH9i+zdo+qPNHqbTCEbXdYSIpQQQQGzjnPz9qudbt7FZlkWK3PJI7xBke5zTuz7xafDBDa2jxxyFhJ3rAtuwPQZHHqfOoL9hdXJZiO7AwoFPFOyrMqW+yqjjQTyTwxASOoQFQBtX2/M1OIi2C7fSiMBRhRgU0mtKiZLGhFQYUYFNJxXWNRsQBk0broJxjmmMaZJcKOAefShmklk4HApLbJRNJIFHNCvcFvCi596cIAOWbca6diLk4A96ZQbID91I3Ltj2rohA5FRXGpW8PQhm9qrpdTuJsiCPAPnT9Ast6VZ4/aScmbmlQsB6Pp1nHaouwbm82qwWTFVonHlTu+BGScCm4Nl9pFl3majmuUhQmQ4FVNzqgQbYeXx1qvZppzumbI9Ksjg9ivJ6DL3VJLj7qAbV9fWg1jYMGbr7UZbWMkuAi4HrVtb2cFuu5vE49ae1FUhab2ZfX5byw7P3t0ZWRNmwZ8y3A/evJkTIJ8xwa9A/irrqyfZ9KgZdobvZQvmR8IP6n6VhGs5xAHIAB5x51RKVsSfo7YjOo2o9HU/rW9ws8ztnDCsToxjhuRLMWG3pxWssbhJZhtY8+o61lzvZp8ai7s7a5Qd6qd5H57fiFbbs3E08XgvYQoPKSAFjx0qi0OB3tiBJjNYXt/e3Gndoo7W1upYEht1/lyFcsxY54+lU4/ulRoytRhyPRO1PaKw07VrXR02i4uhl3ByE8gD8yCPpTQjEV4/FA9zp11fPI7zxyh97PuYgDnJ8+or1TSdS+1aZa3B+KSJWY+pxzWuEOK0YZZObCXQD4utQvIqiiTMHxmqm4wLhuuKWXICJJLnPC0Od7nxNj2rslxDEvJUfKq+41eNf5YLN700YsjZYd0qjOB8zUE95DEPEwLegqne5uZzlm2p6Uzu4hyfE3rTfagWFS6q75FvHz+KgpDcXB+9lx7VJuPRRgU3uyeTUtvohCIkTy3H1p249AMVN3a+dIhUqV7AD7GpVN3y0qGiGoa5SNfGfpQc13JLwowtBKXlbJ60fa2m74vWupwSK+bbHW8TOwq3tbZEw0vPoKiiCRgKtD63fGx02WbLCTG1Mep6f8An6VXNOi1MJ1PtFp2kjuZJQZcZ7qIZbzrNX3b8yHu7WxfxqcPLKOvpwOP/wB9KxM0zSyu2STk5J6k+ZqJpGDDPTyrE5WwtnZLmWS5kvJxvleTxvn4T6D0FNnupnHdxARAc8nOand44wjyrmOXKv7+VNjty0QXOQP5b/iFLaFIYJF3DvDtY/1DpV9o5Qzq6yD4gPaqYW3ocmnxxzRNvUsCPMUkopjxm4Oz2azb7LbB36Mua85/ihZ/+6Wl/glZou7Jz0ZSTj6g/pUGn9opbeAW07s1v0Kc4A9v+KNuLqxu9K+z2arcM8ysVmOTEByWH7f4rPDHLHOzTPLDJCrKCzuu60a4tYUy9w4HebuAPT/fWtxZj7BYQQq4KxIFyD1rPxaTazhprDcYEPjTBAZv7WNV2mXNwbiW2uTKdp4iY8r6/Ot+HMt2jFJema6TW1TjrQ0l/d3BwPAhoaBrc5WE5deDkEEU47iSOfrVtcti20PFpv8Ajk3GndxsHhWolikzkHFXXZ/Q73W7nurc7UTmWd/hjX1z6+3/ADSThoKkV2jaVf6zqC2dlBvduSTwqD1Y+QrQWeh6XY6xcWuru95aooCy27Yw/n9OtX093baZaNpmhjbBjE1yfjnPmc+QqmIxWWTp0h6YXL2K0u9OdE1lBITxDdrg/mB/g1Q6v2U17TNzzafLJGP+5b/eL8+On5VYMxHlmi7TXdTsSDb3UmPwk7h+Rqc30SjAvI+SpBBHUEVHgnrXpU2vWeo+HXNGtLsY5lQbHH1quuOz/Zi/ydP1G506Rv8At3K94nyz5UylH5JTMNtpUTf2b2d5Lb97FN3bY7yNgVb5Uqs4oBcWrIkmzbk+tWS5xnyoNpok5HxU3vpJDx0rt/S9mXnXRYGdUHHxeVZHtpqJklWAfDGNxHq1aWOEgF5OAOTXnWs3BuJppSMGVyayea1CKiWY25bK2LmORvR8/kK7I/Ab5VyzOVkHyH5g0xf5JX8JxXNotDzF9osjGP5i+NPf1H+fpUNpIUUA5wORj1qSxl2Iky9Yz+lSX6JFcF4/hk5/Ol/AfyEb1uE35G49SKnigAA3Pk1WWchBIFWUDs2M9KVoayZtOikGWJyfMUptNCRolrcFJc7s8ZI9OOf8UdaqhwpPXyo6dFgtiIFClyNzY52+dLy2BoZodzcz2DW06/eQtgn8Q9fzzUOoWIkvVvIhiUAKy/5ovTHCyC63AopKk9Bj/cUy81+1gdtqPN7AcUu70MvRXvujilYjkAE/L/f3qySRHhjdDneoP186o7/XUuFbZbBNylTk/wC+tWHZi8jkjFsLNpp9xwX+EL5f5q/Dk4P7iSxt9Gj7PaBca1I8skn2awh/n3LdB/aPU/77HTXt9BHaLpukRfZ9OQ4xnDS+7UNPqM9zZwWzpFb28SALBAMJn1x50KW3VMubk9CRjRwkeWajJpzGoXYAcjPpmqBzj1E1Qxajaz3b2scyvMq5ZR6U+eRIlLE7RRRLoax656VWXd7kmOLj+6uXNy03hXhfT1obb7Yq+GGtyEcgYrkknBPvSonbSq3RXZYxQjPi60bGqpVYlw2Mk4Fck1BE4zk16Gk9yMt0WOpXHd6dcsnXuiPzFea6hw4H9tanUL15rV0HRsD9ayt4c3E35VxvOcXNcTRiviCWrY3j2z+VLpcOvqc1FG21wfenhsXSk9OKxssCLFh3jxt/VzRdwBJb7T8cZ4+VV4Hd3Cn3o25O7B9qUZEdsyqu49SaNhcA5FBIVA5pwkCnAoNWEvLWUtICKs7k77cof6hj6VQabIzTAKM1eLFIyNPImR5L61VLTLcceWzNXF9JENsjFlThUz0FQd+8y7yMg9AvFQ3Dlp5CylCWPhHlTAU6sWBqzjYOTs2XZm60240y6sE0hJdSk2mK4I4gGeSSf2rU6ZYw6fD3cIBY/FIerVjewsJF3PdKx7sJtIPmetbTvABwcg1WySbewkthcc7R5GqPW+01pprSQKxku1TKxY4J9Cam1i+e00+aeNdzKvA9688luJQ0kt0qST3C7ty+X+4oqNim00fX5rrC38KRPJyhRuGxQvabXltbdoYHzO/HXpWOhu5VK7pWBjJwfQ0yZxKweSQtMSck+Xp/mm4kbL/sfIIbmeZhuwvDerH/AE1dz3Jlcu1Vmi25isEz1c7qO24rVCCWyqcn0c3k9K4S1PArhFMxUR5alUmKVKEGnSZT8W4YqCOB5X9qM+mKmgHPXFejl4sZzuznLI4oDuo9kaD0YGsrK293b1NazVm7u3znPOfyBrISH4vma4n6jFQz0jbgdwBH6/WuvxtPtSPJrjVjLAmFg+B50SxOOarom2uDVjFE8xURjk+dKxkRH25b0ouDT5H8cp2JjoOpq60LTyLZpiBI0gKMpx8Pn+1VGnyd1qd1CshMKFgufLBqSWrGxtXTL7TrREiyFC/vVmjlQDGpYheA1Vltdr8KtnFOl1KSIghQMeZrPZrrRl9SDrfz71bO85xQ6hS3wsPLmj7kLNdSSzSoHY5IzQ/e2sTgEFuc8NVsdozy7NloMB06wELEFmbece4FWL3GBmswuq7Y94OVbjwnpXW1UMNqhiemKVp2Cw3XtR22Ui/iUisUDwG9qvriw1K/HMPdxgElmYcjH/FUONyj/NWqNIF2OVRvBPQ0Wlr3wRoV3Fm24HkahiiaXCL9B71oNMtXs1xI+5mIOPSmhjc2ByUVsto4+7iRPwqBTsVIenTH+abitNUU97G4roFc6U4c0rIjmKVPxSpBiMQs2CTgVPFAoHTd71mpb24JxnANXunyP3KknPFesxZVKVJHIkmkBdpmEUSKBjwk/qKx7EEFPOtN2nlZ2XPTb/k1lWX7wBPiJx8q81+oO/JkdLAqxojYlTg0+OJpRuyFQdWJoyG3jyxJPHHzqG9Yd5sjACIOMVjv4Lq+Se2sECiR23KRkADH51ZWRAuYUXhSrDj/AH2qutLgNAsZ+McfSnSzFGVk+NOaV2PFpF3fznTtNSO1G+Qht7vjC/IVmbacJIWZ8Fupo2W4addxOFPJqulZC33Ywo4+dRO+wySi7iFNed2Sqcn1qOS9uHGGf6ULTs0yihXJsdk+dNPWuilijQtj4JjGSAcZFSpMUIZm96GApxGVxQZCwutbupLc26y7YyOcdTQcBUYz6UPjP0roU9QcVHsKdBseoNa3CSRrnact7jzFahZe/jWaEM8ZAbcFyKqNE7OvdWM+pzx77SGRY2OeWY+QH+9a1N5qV5HYxRRtHFBNHtEcYACqOgp8WRxdRBKKltiVtygjpikaitzmFcHNPrRJ7ER3NdFNroqpsY7SrlKgQg7UWFrbdqfsdpHsgZ48qM4GQCce3NenW/YPTDaqYpZFG0Ekn2rz3tJ972/WPJOJYuvl4Vr0vtXPND2K1prbd3q2Mm3b1HhIP6Vo8rysuKaWOVezJ4EI5MClNHhHa28tLjXJ4tOdpLSN9iSMfjA4J+WentVdbqiMCB4vESfbFR2UR2SzHqo2r865aPmZk/ECKxylKTbk7ZsVLSQ4SAOqk5O7DUPMoSR1XoDxTJThuOooq8iYiOYDiQAk+/nQQQeGRUySPrUsjAsSDmoCNr4zmpfLNRgGybtvHSox0pxk8qaBRRBU7FdCgDJ6U0yJnw1CDwtOCUxJWx0zRenK9xeJH3Am89nPPI9OaVugpWct7eaaQJbQTTy9QkSFz+QpsnfWUipc20sRPOJEKlh8jUt8ZE1CUuiW7uFJWMBVUEAjAHTrUmowyDTbaa5SQFnk7suCNwwnT1FAIHexqk52fCwDCmRLncTyFBJFcacuEU/0n18vSp3UKd8RypQge3FN0A3n8Oo5bzR+00RO5DH11.DKq56MpYftihp9p0wDHiSbAOPIimfw/vpdNtdU2nm6jjQA9MDOf0IqbWEWFGjUYHeZ/SrMUt0LJDLJswDnODip88UFpz5jPtRinK1bPsEehwpZpgNdJqoI7NKo91KgEJ1E9//ABMK7iQJkAz7IteuKEmjeCVA8cilHU9GBHSlSqvzH+6VeB/Xj/h4L2m0L/pzUrvThIZI1IeJj1KHkZ96ywcxzq4/pbNKlQh0XS7H3Ee+fKfCx49qLvgI0hhXoi0qVEBXjn/7HFPjRpBsTrziu0qsgk3TA+iEnHFc3kdKVKo9aJ8I4zFjk1wV2lQId+uKkieSN90Ujq2MZU44pUqjCSQSyRSvJHI4dhtLhua600svM0ryHplmJpUqBCGVQDkCprY7sqfwn9qVKg+iI9A7OwRRdkWYqvei5BL45wQOKh10ZmkHl4WFKlQxfyDIr9PbxtRwbilSrRPsRC3Uia5SpAnM0qVKgE//2Q=="
  },
  {
    id: 2,
    name: "Rohan Desai",
    role: "Traveler",
    quote: "You won't regret it. I would like to personally thank you for your outstanding product. Absolutely wonderful!",
    rating: 5,
    image: "https://img.freepik.com/free-photo/smiling-young-male-professional-standing-with-arms-crossed-while-making-eye-contact-against-isolated-background_662251-838.jpg?semt=ais_incoming&w=740&q=80"
  },
  {
    id: 3,
    name: "Ananya Patel",
    role: "Designer",
    quote: "This has completely transformed my workflow. The attention to detail and user experience is simply unmatched.",
    rating: 5,
    image: "data:image/jpeg;base64,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.DKq56MpYftihp9p0wDHiSbAOPIimfw/vpdNtdU2nm6jjQA9MDOf0IqbWEWFGjUYHeZ/SrMUt0LJDLJswDnODip88UFpz5jPtRinK1bPsEehwpZpgNdJqoI7NKo91KgEJ1E9//ABMK7iQJkAz7IteuKEmjeCVA8cilHU9GBHSlSqvzH+6VeB/Xj/h4L2m0L/pzUrvThIZI1IeJj1KHkZ96ywcxzq4/pbNKlQh0XS7H3Ee+fKfCx49qLvgI0hhXoi0qVEBXjn/7HFPjRpBsTrziu0qsgk3TA+iEnHFc3kdKVKo9aJ8I4zFjk1wV2lQId+uKkieSN90Ujq2MZU44pUqjCSQSyRSvJHI4dhtLhua600svM0ryHplmJpUqBCGVQDkCprY7sqfwn9qVKg+iI9A7OwRRdkWYqvei5BL45wQOKh10ZmkHl4WFKlQxfyDIr9PbxtRwbilSrRPsRC3Uia5SpAnM0qVKgE//2Q=="
  },
  {
    id: 4,
    name: "Maksudhan Kumar",
    role: "Developer",
    quote: "Exceptional quality and support. It seamlessly integrated into our existing system without any hassle.",
    rating: 5,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1yrQGSJdEw_1qS4xeNmeKrZioB3R7Zp4Y9PYuCHMup6KFUqs8b00UBF4&s"
  },
  {
    id: 5,
    name: "Jagdish Prasad",
    role: "Marketing Manager",
    quote: "A game changer for our team. The analytics and reporting features alone saved us hours every single week.",
    rating: 5,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5N5PMJXAt5K1wNywVq4zJusq_TTuCDVMNlYnJWkEBvZ760uVrgFWLtJk&s"
  },
  {
    id: 6,
    name: "Vikram Gupta",
    role: "Product Manager",
    quote: "This product exceeded my expectations in every way. The level of detail and craft is just superb. We were able to launch faster thanks to it!",
    rating: 5,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTq16nWGFO_aLzjDTWWoChfO93qJPtZstcTQjCdMuVLjlWiWBwxoMKH6Yk&s"
  },
  {
    id: 7,
    name: "Sanya Arora",
    role: "Architect",
    quote: "The intuitive nature of the design made it an absolute pleasure to use. The transition was flawless. A huge thumbs up!",
    rating: 5,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5odm7ZfNup4CUUBiF60OD5CUkDE9xqBFHXpaSI0LZuLqGvmL-aUunAKs&s"
  },
  {
    id: 8,
    name: "Arun Singh",
    role: "Consultant",
    quote: "We were looking for something exactly like this to streamline our processes. The simplicity and effectiveness are its core strengths.",
    rating: 5,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBJanSJek3xuLceDwoNHIpzfYc1iY8ktoiHIF23mUXDC4oq9VvInmX9oM&s"
  }
];

export default function App() {
  const [activeIndex, setActiveIndex] = useState(1);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const getCardClassName = (index) => {
    const length = testimonials.length;
    
    // Determine relative positions with wrap-around
    const isCenter = index === activeIndex;
    const isLeft = index === (activeIndex - 1 + length) % length;
    const isRight = index === (activeIndex + 1) % length;

    // Base classes for all cards
    let baseClass = "absolute transition-all duration-500 ease-in-out w-[90%] md:w-[750px] bg-[#f2f2f2] shadow-xl p-6 md:p-10 flex flex-col md:flex-row gap-8 items-center rounded-sm ";

    if (isCenter) {
      return baseClass + "translate-x-0 scale-100 opacity-100 z-20 pointer-events-auto";
    } else if (isLeft) {
      return baseClass + "-translate-x-[50%] md:-translate-x-[75%] scale-75 opacity-40 z-10 pointer-events-none";
    } else if (isRight) {
      return baseClass + "translate-x-[50%] md:translate-x-[75%] scale-75 opacity-40 z-10 pointer-events-none";
    } else {
      return baseClass + "opacity-0 scale-50 z-0 pointer-events-none";
    }
  };

  return (
    <div className="min-h-screen bg-[#e5e5e5] flex flex-col items-center justify-center py-16 overflow-hidden">
      
      {/* Header Section */}
      <div className="text-center mb-16 px-4">
        <h2 className="text-3xl md:text-5xl font-serif text-gray-800 mb-4 tracking-tight">
          This Is What Our Customers Say
        </h2>
        <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque duis.
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative w-full max-w-7xl h-[500px] md:h-[400px] flex justify-center items-center">
        {testimonials.map((testimonial, index) => (
          <div key={testimonial.id} className={getCardClassName(index)}>
            
            {/* Image Section with offset background box */}
            <div className="relative w-40 h-40 md:w-56 md:h-64 shrink-0 mt-4 md:mt-0">
              {/* Darker background offset square */}
              <div className="absolute top-4 -left-4 md:top-4 md:-left-6 w-full h-full bg-[#d4d4d4] -z-10"></div>
              <img 
                src={testimonial.image} 
                alt={testimonial.name} 
                className="w-full h-full object-cover shadow-md bg-white"
              />
            </div>

            {/* Content Section */}
            <div className="flex flex-col justify-center text-left flex-1 md:pl-4">
              <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-6">
                {testimonial.quote}
              </p>
              
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 md:w-5 md:h-5 ${i < testimonial.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`} 
                  />
                ))}
              </div>

              <div>
                <h4 className="text-xl md:text-2xl font-serif text-gray-800 mb-1">
                  {testimonial.name}
                </h4>
                <p className="text-xs md:text-sm text-gray-500 uppercase tracking-wider">
                  {testimonial.role}
                </p>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="flex gap-6 mt-12 z-30 relative">
        <button 
          onClick={prevSlide}
          className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:border-gray-800 transition-colors"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button 
          onClick={nextSlide}
          className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:border-gray-800 transition-colors"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
}