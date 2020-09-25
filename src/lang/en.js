export default {
    home: {//首页文案
        h1: 'Continuous value transfer for real-time payment',
        h2: 'Through the programming of currency, we established a smart contract for real-time payment and deployed it on Ethereum',
        startBtn: 'Start',
        introduce: {
            title: 'Introduce of Contracts',
            sablierTitle: 'Fixed Deposit',
            sablierVal: 'Between the start time and the stop time, the stream flows to the recipient at a rate per second.',
            fixedTitle: 'Fixed Flowrate',
            fixedVal: 'The stream flows to the recipient at a rate per second after the start time until it equals the max amount paid. No need to set stop time, could increase the max payment amount to extend stream.',
            installmentTitle: 'Installment',
            installmentVal: 'Try to pay by installments, set the number of installments at will, and no longer tie up cash flow.',
            installmentDPTitle: 'InstallmentWithDP',
            installmentDPVal: 'Add a down payment to your stream to meet more scenarios.',
        },
        footer: {
            contactTitle: 'Contact Us',
            focusText: 'Scan and focus on us',
        }
    },
    header: {//头部文案
        streampay:'StreamPay',
        home:'Home',
        dash:'DashBoard',
        docs:'Docs',
        metamask:'Please Install MetaMask wallet!'
    },
    dashboard: {//仪表盘文案
        dash:'DashBoard',
        stream:{
            fixedDeposit:'Fixed Deposit',
            fixedFlowrate:'Fixed Flowrate',
            installment:'Installment',
            installementWithDP:'InstallementWithDP',
        },
        create:'Create Stream',
        info:{
            id:'ID',
            sender:'Sender',
            recipient:'Recipient',
            deposit:'Deposit',
            startTime:'Start Time',
            stopTime:'Stop Time',
            maxAmount:'MaxAmount',
            ratepersecond:'RatePerSecond',
            numbeOfInstallments:'NumbersOfInstallments',
            downpaymentRatio:'DPRatio',
            maxStopTime:'StopTime',
            checkStream:'Check',
            cancel:'Cancel',
            operation:'Operation',

        }
    },
    streamInfo: {//详情文案，streamInfo和cancelInfo可以共用
        streaminfo:'Information',
        details:{
            info:'Info Details',
            withdrawl:'Withdrawl',
            addAmount:'AddAmount',
            installment:'Installment',
            cancel:'Cancel',
        },
        info:{
            copy:'Click Copy:{who}',
            sender:'Sender',
            recipient:'Recipient',
            deposit:'Deposit',
            startTime:'Start Time',
            stopTime:'Stop Time',
            maxAmount:'MaxAmount',
            ratepersecond:'RatePersecond',
            numbeOfInstallments:'Numbers Of Installments',
            downpayment:'Downpayment Amount',
            havebeenStreamed:'Have Been Streamed',
            senderBalance:'SenderBalance',
            recipientBalance:'RecipientBalance',
            fees:'Fees',
            haveBeenNumberOfInstallment:'Have Been Number Of Installment',
            nextOfInstallmentTime:'Deadline for Next Pay',
            duration:'Duration'
        },
        function:{
            withdraw:'Please input the amount of withdrawl',
            operation:'Operation',
            confirm:'Confirm',
            cancel:'Cancel',
            format:'The amount input format is incorrect!',
            withdrawlSuccess:'Withdrawl Success!',
            withdrawlFailure:'Withdrawl Failure!',
            operationHint:'Operation Tips',
            nextOfInstallmentTime:'Past the next payment deadline!',
            pay:'Amount payable for the current period:',
            paySuccess:'Payment Success!',
            payFailure:'Payment Failure!',
            addInput:'Please input the INCREASE amount:',
            addSuccess:'Increase Success!',
            addFailure:'Increase Failure!',
            cancelStream:'Whether to cancel the Stream?',
            cancelSuccess:'Cancel Success!',
            cancelFailure:'Cancel Failure!',
        },
    },
    cancelStream: {//创建流文案
        streaminfo:'StreamInfo',
        details:{
            info:'Info Details',
        },
        info:{
            sender:'Sender',
            recipient:'Recipient',
            deposit:'Deposit',
            startTime:'Start Time',
            stopTime:'Stop Time',
            actualStopTime:'Actual StopTime',
            maxAmount:'MaxAmount',
            ratepersecond:'RatePersecond',
            numbeOfInstallments:'Numbes Of Installments',
            downpayment:'Downpayment Amount',
            endedStreamed:'Stream Ended',
            endOfsenderBalance:'Ended SenderBalance',
            endOfrecipientBalance:'Ended RecipientBalance',
            fees:'Fees',
            haveBeenNumberOfInstallment:'Have Been Number Of Installment',
            duration:'Duration',
            haveBeenPaidAmount:'Have Been Paid Amount',
        },
    },
    createstream:{
        create:{
            create:'Create Stream',
            types:'Types',
            who:'Who is recipient? (ENS name or Ethereum address)',
            deposit:'Deposit',
            maxAmount:'MaxAmount',
            ratepersecond:'Rate per Second',
            token:'TokenAddress',
            choose:'Choose TokenAddress',
            time:'Start Time and Stop Time',
            startTime:'Start Time',
            stopTime:'Stop Time',
            to:'To',
            choosetime:'Please Choose Time',
            numbeOfInstallments:'Numbers Of Installments',
            fees:'Fees(per period per token per second fees,uint is 1 / 10**18)',
            downpaymentRatio:'Downpayment Ratio',
            creating:'Create Stream ...',
            createSuccess:'Create Success',
        },
        validate:{
            recipient:'Must be filled in recipient!',
            tokenAddress:'Must be filled in tokenAddress!',
            maxAmount:'The maxAmount is required and must be bigger than 0!',
            ratePerSecond:'The ratePerSecond is required and must be bigger than 0!',
            startTime:'The startTime is required and must be bigger than now!',
            deposit:'The deposit is required and must be bigger than 0!',
            dateTime:'The start time and stop time is required and start time must be bigger than now!',
            numberOfInstallments:'The numberOfInstallments is required and must be bigger than 1!',
            feesOfRecipientPer:'The feesOfRecipientPer is required and minimum is zero!',
            remainder:'Duration divided by number of installments must not have a remainder!',
            downPaymentRatio:'The down payment ratio is required, and the range is between 0 ~ 100!',
        }
    }
}