import React, { useState, useEffect } from 'react';
import UserNav from '../../components/nav/UserNav';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify'
import {CheckCircleOutlined, CloseCircleOutlined} from '@ant-design/icons'
import { PDFDownloadLink } from "@react-pdf/renderer";
import Invoice from "../../components/order/Invoice";
import { fetchUserOrders } from '../../functions/user'
import ShowPaymentInfo from '../../components/cards/ShowPaymentInfo'

function History() {
    const [orders, setOrders] = useState([])

    const {user} = useSelector(state => ({...state}))

    useEffect(() => {
        loadUserOrders()
    }, [])

    const loadUserOrders = () => {
        fetchUserOrders(user.token)
        .then(res => {
            console.log(JSON.stringify(res.data, null, 4))
            setOrders(res.data)
        })
        .catch(err => console.log(err))
    }

    const showOrderInTable = (order) => (
        <table className="table table-bordered">
            <thead className="thead-light">
                <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Price</th>
                    <th scope="col">Brand</th>
                    <th scope="col">Color</th>
                    <th scope="col">Count</th>
                    <th scope="col">Shipping</th>
                </tr>
            </thead>
            <tbody>
                {order.products.map((p, i) => (
                    <tr key={i}>
                        <td>
                            <b>{p.product.title}</b>
                        </td>
                        <td>{p.product.price}</td>
                        <td>{p.product.brand}</td>
                        <td>{p.color}</td>
                        <td>{p.count}</td>
                        <td>
                            {p.product.shipping === "Yes" ? (<CheckCircleOutlined className="text-success"/>) : (<CloseCircleOutlined className="text-danger"/>)}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )

    const showDownloadLink = (order) => (
        <PDFDownloadLink
        document={<Invoice order={order} />}
        fileName="invoice.pdf"
        className="btn btn-sm btn-block btn-outline-primary"
        >
        Download PDF
        </PDFDownloadLink>
    );

    const showUserOrders = () => orders.map((order, i) => (
        <div className="m-5 p-3 card" key={i}>
            <p>Show Payment Info</p>
            {ShowPaymentInfo(order)}
            {showOrderInTable(order)}
            <div className="row">
                <div className="col">{showDownloadLink(order)}</div>
            </div>
        </div>
    ))

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <UserNav />
                </div>
                <div className="col-md-8">
                    <h4>{orders.length > 0 ? 'User Purchase History' : 'No Purchase Orders'}</h4>
                    {showUserOrders()}
                </div>
            </div>
        </div>
    )
}

export default History
