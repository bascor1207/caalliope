import { Button } from '@nextui-org/react';

export const CustomButton = ({ buttonLabel }) => {
    return (
        <Button
            radius='lg'
            color='success'
        >
            {buttonLabel}
        </Button>
    )
}
