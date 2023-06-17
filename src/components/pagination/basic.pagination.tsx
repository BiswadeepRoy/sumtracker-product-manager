import { Button, Space } from "antd";
import { FC } from "react";
import { PaginationUIInterface, UrlType } from "../../interface/common";
import { useNavigate, createSearchParams } from "react-router-dom"

const Pagination: FC<PaginationUIInterface> = ({ next, prev, reset, onNextClick, onPrevClick, onResetClick }) => {

    const navigate = useNavigate()

    const handlePrev = () => {
        onPrevClick?.(prev);
    }

    const handleNext = () => {
        onNextClick?.(next);
    }

    const handleReset = () => {
        navigate({
            pathname: window.location.pathname,
        }, { replace: true })
        if(onResetClick) {
            onResetClick();
        }
    }

    return (
        <Space
            style={{ display: 'flex', justifyContent: 'end' }}
            align={'end'}
        >
            {reset && <Button
                onClick={handleReset}
            >Reset</Button>}
            <Button
                onClick={handlePrev}
                disabled={!prev}
            >Prev</Button>
            <Button
                onClick={handleNext}
                disabled={!next}
            >
                Next
            </Button>
        </Space>
    )
}

export default Pagination;