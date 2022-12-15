import { ViewIcon } from "@chakra-ui/icons";
import {
    IconButton,
    useDisclosure,
    Text,
    ModalFooter,
    Button,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Modal,
    Input,
    Stack,
    useToast,
    InputGroup,
    InputRightElement,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";

const ChangePasswordModal = ({ children }) => {
    const { user } = ChatState();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast()
    const [password, setPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [error, setError] = useState([false, false, false])
    const [msg, setMsg] = useState('')
    const [cfPassword, setCfPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPw, setShowPw] = useState([false, false, false])

    const handleChangePw = (e) => {
        setPassword(e.target.value)
    }

    const handleChangeNewPw = (e) => {
        setNewPassword(e.target.value)
        if (e.target.value.trim() === "") {
            setError([false, true, false])
            setMsg('Không được bỏ trống trường này')
        }
        else if (e.target.value.length < 8) {
            setError([false, true, false])
            setMsg('Mật khẩu không được ít hơn 8 kí tự')
        }
        else if (e.target.value !== cfPassword) {
            setError([false, false, true])
            setMsg('Mật khẩu không trùng khớp')
        }
        else {
            setError([false, false, false])
            setMsg('')
        }
    }

    const handleChangeCfPw = (e) => {
        setCfPassword(e.target.value)
        if (e.target.value !== newPassword) {
            setError([false, false, true])
            setMsg('Mật khẩu không trùng khớp')
        }
        else {
            setError([false, false, false])
            setMsg('')
        }
    }

    const handleShowPassword = (index) => {
        let newState = [...showPw]
        newState[index] = !newState[index]
        setShowPw(newState)
    }

    const handleSubmit = async () => {
        if (error.every(e => e))
            return
        setLoading(true)
        const config = {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
        };
        axios.put("/api/user/change-password",
            {
                password,
                newPassword,
                cfPassword
            }
            , config)
            .then(response => {
                const { data } = response
                toast({
                    title: data.message || 'Đổi mật khẩu thành ',
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            })
            .catch(err => {
                toast({
                    title: err?.response?.data?.message || 'Đổi mật khẩu không thành công ',
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
            {children ? (
                <span onClick={onOpen}>{children}</span>
            ) : (
                <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
            )}
            <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign={'center'} fontSize="28px" fontFamily="Work sans">
                        Đổi mật khẩu
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDir="column"
                        alignItems="center"

                    >
                        <Stack spacing={4}>
                            <InputGroup>
                                <Input
                                    width='360px'
                                    fontSize='20px'
                                    value={password}
                                    onChange={handleChangePw}
                                    placeholder='Mật khẩu hiện tại'
                                    size='lg'
                                    type={showPw[0] ? 'text' : 'password'}
                                />
                                <InputRightElement width="4.5rem">
                                    <Button h="1.75rem" size="sm" onClick={() => handleShowPassword(0)}>
                                        {showPw[0] ? "Hide" : "Show"}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                            <InputGroup>
                                <Input
                                    isInvalid={error[1]}
                                    fontSize='20px'
                                    value={newPassword}
                                    onChange={handleChangeNewPw}
                                    placeholder='Mật khẩu mới'
                                    size='lg'
                                    type={showPw[1] ? 'text' : 'password'}
                                />
                                <InputRightElement width="4.5rem">
                                    <Button h="1.75rem" size="sm" onClick={() => handleShowPassword(1)}>
                                        {showPw[1] ? "Hide" : "Show"}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                            {error[1] &&
                                <Text color='crimson'>
                                    {msg}
                                </Text>}
                            <InputGroup>
                                <Input
                                    isInvalid={error[2]}
                                    fontSize='20px'
                                    value={cfPassword}
                                    onChange={handleChangeCfPw}
                                    placeholder='Nhập lại mật khẩu'
                                    size='lg'
                                    type={showPw[2] ? 'text' : 'password'}
                                />
                                <InputRightElement width="4.5rem">
                                    <Button h="1.75rem" size="sm" onClick={() => handleShowPassword(2)}>
                                        {showPw[2] ? "Hide" : "Show"}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                            {error[2] &&
                                <Text color='crimson'>
                                    {msg}
                                </Text>}
                        </Stack>

                    </ModalBody>
                    <ModalFooter justifyContent={'center'}>
                        <Stack mt={2}>
                            <Button
                                onClick={handleSubmit}
                                isLoading={loading}
                                colorScheme='blue'>Cập nhật</Button>
                        </Stack>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ChangePasswordModal;
