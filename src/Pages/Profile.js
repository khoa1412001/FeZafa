import { Avatar, Box, Button, Divider, Heading, Input, Stack, useToast } from '@chakra-ui/react'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import ChangePasswordModal from '../components/miscellaneous/ChangePasswordModal';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import { ChatState } from '../Context/ChatProvider';

function Profile() {
    const { user } = ChatState();
    const [fullname, setFullname] = useState(user?.fullname || '')
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const handleChangeFullname = (e) => {
        setFullname(e.target.value)
    }
    useEffect(() => {
        if (user) {
            setFullname(user?.fullname)
        }
    }, [user])

    const handleSubmit = async () => {
        if (fullname.trim() === '') {
            toast({
                title: 'Vui lòng nhập họ và tên',
                status: "warnig",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return
        }
        setLoading(true)
        const config = {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
        };
        axios.put("/api/user/update-profile", { fullname: fullname.trim() }, config)
            .then(response => {
                const { data } = response
                toast({
                    title: data.message || 'Cập nhập thành công',
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
                let newUser = {
                    ...user,
                    fullname: fullname.trim()
                }
                localStorage.setItem("userInfo", JSON.stringify(newUser));
            })
            .catch(err => {
                toast({
                    title: err?.response?.data?.message || 'Cập nhật không thành công ',
                    status: "warning",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            })
            .finally(() => setLoading(false))
    }
    return (
        <>
            <div style={{ width: "100%" }}>

                {user && <SideDrawer />}
                <Box
                    display="flex"
                    flexDir="column"
                    alignItems={'center'}
                    m='auto'
                    p={3}
                    bg="#F8F8F8"
                    w="96%"
                    h="91.5vh"
                    borderRadius="lg"
                    overflowY="hidden"
                >
                    <Heading as='h2' size='lg' lineHeight={'unset'}>
                        Thông tin cá nhân
                    </Heading>

                    <Divider color={'blackAlpha.400'} orientation='horizontal' />
                    <Avatar size='2xl' my={4} name={user?.fullname} src={user?.avatar} />
                    <Stack width='440px' spacing={6} pt={3}>
                        <Stack fontSize={'20px'} spacing={0} flexDir='row' gap='10px' alignItems='center'>
                            <label style={{ width: '110px', fontWeight: 500 }}>Họ và tên</label>
                            <Input
                                flex={1}
                                fontSize='20px'
                                value={fullname}
                                onChange={handleChangeFullname}
                                placeholder='Họ và tên'
                                size='lg'
                            />
                        </Stack>
                        <Stack fontSize={'20px'} spacing={0} flexDir='row' gap='10px' alignItems='center'>
                            <label style={{ width: '110px', fontWeight: 500 }}>Email</label>
                            <h2>{user?.email}</h2>
                        </Stack>
                        <Stack pt={4} flexDir={'row'} spacing={0} gap={2} justifyContent='center' alignItems={'center'}>

                            <Button
                                onClick={handleSubmit}
                                isLoading={loading}
                                colorScheme='blue'>
                                Cập nhật
                            </Button>
                            <ChangePasswordModal>
                                <Button
                                    colorScheme='yellow'>
                                    Đổi mật khẩu
                                </Button>
                            </ChangePasswordModal>
                        </Stack>
                    </Stack>
                </Box>
            </div>
        </>
    )
}

export default Profile