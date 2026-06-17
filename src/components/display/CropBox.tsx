import React from 'react';

import Flex from '#/Flex';
import Grid from '#/Grid';

interface CropBoxProps {
    cropBox: {
        x: number,
        y: number,
        width: number,
        height: number,
    },
    setCropBox: (cropBox: {
        x: number,
        y: number,
        width: number,
        height: number,
    }) => void,
}

const CropBox = ({
    cropBox,
    setCropBox,
}: CropBoxProps) => {
    return (
        <Flex
            border borderColor='blue'
            alignItems='center'
            justifyContent='center'
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 2,
                backgroundColor: 'rgba(0, 0, 0, 0.2)',

                pointerEvents: 'none',
            }}
        >
            <Grid columns={3} rows={3} border borderColor='red' style={{
                width: cropBox.width,
                height: cropBox.height,
                zIndex: 3,
            }}>
                {Array.from({ length: 9 }).map((_, index) => (
                    <Flex key={index} style={{
                        width: cropBox.width / 3,
                        height: cropBox.height / 3,
                        // borderWidth: 1,
                        // borderColor: 'green',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }} />
                ))}
            </Grid>
        </Flex>
    );
};

export default CropBox;
