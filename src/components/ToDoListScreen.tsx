import React, { useState, useEffect } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Modal,
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

interface Task {
    id: number;
    title: string;
    about: string;
}

const API_URL = 'http://192.168.0.202:3000';

const ToDoListScreen: React.FC = () => {
    const [title, setTitle] = useState<string>('');
    const [about, setAbout] = useState<string>('');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [activeTaskIndex, setActiveTaskIndex] = useState<number | null>(null);
    const [isShareMenuVisible, setIsShareMenuVisible] = useState<boolean>(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState<boolean>(false);
    const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

    // Estados para o modal de edição
    const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
    const [editTaskTitle, setEditTaskTitle] = useState<string>('');
    const [editTaskAbout, setEditTaskAbout] = useState<string>('');
    const [taskToEdit, setTaskToEdit] = useState<number | null>(null);

    // Função para buscar tarefas da API
    const fetchTasks = async (): Promise<void> => {
        try {
            const response = await fetch(`${API_URL}/tasks`);
            const data = await response.json();
            setTasks(data); // Atualiza o estado com as tarefas
        } catch (error) {
            console.error('Erro ao buscar tarefas:', error);
        }
    };

    useEffect(() => {
        fetchTasks(); // Carregar tarefas ao montar o componente
    }, []);

    // Função para adicionar tarefas
    const handleAddTask = async (): Promise<void> => {
        if (title && about) {
            try {
                const response = await fetch(`${API_URL}/tasks`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ title, about }),
                });

                if (response.ok) {
                    const newTask = await response.json();
                    setTasks([...tasks, newTask]); // Atualiza a lista de tarefas
                    setTitle('');
                    setAbout('');
                }
            } catch (error) {
                console.error('Erro ao adicionar tarefa:', error);
            }
        }
    };

    // Função para remover tarefas
    const handleConfirmDeleteTask = async (): Promise<void> => {
        if (taskToDelete !== null) {
            try {
                const response = await fetch(`${API_URL}/tasks/${taskToDelete}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    const updatedTasks = tasks.filter(task => task.id !== taskToDelete);
                    setTasks(updatedTasks); // Remove a tarefa do estado
                    setIsDeleteModalVisible(false);
                }
            } catch (error) {
                console.error('Erro ao deletar tarefa:', error);
            }
        }
    };

    // Função para salvar a edição da tarefa
    const handleSaveEditedTask = async (): Promise<void> => {
        if (taskToEdit !== null) {
            try {
                const response = await fetch(`${API_URL}/tasks/${taskToEdit}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ title: editTaskTitle, about: editTaskAbout }),
                });

                if (response.ok) {
                    const updatedTask = await response.json();
                    const updatedTasks = tasks.map(task =>
                        task.id === taskToEdit ? updatedTask : task
                    );
                    setTasks(updatedTasks); // Atualiza o estado com a tarefa editada
                    setIsEditModalVisible(false);
                }
            } catch (error) {
                console.error('Erro ao editar tarefa:', error);
            }
        }
    };

    // Abrir modal para confirmar a exclusão
    const handleRemoveTask = (id: number): void => {
        setTaskToDelete(id);
        setIsDeleteModalVisible(true);
    };

    // Abrir modal de edição
    const handleEditTask = (task: Task): void => {
        setEditTaskTitle(task.title);
        setEditTaskAbout(task.about);
        setTaskToEdit(task.id);
        setIsEditModalVisible(true);
    };

    // Alternar tarefa ativa
    const handleToggleTask = (index: number): void => {
        setActiveTaskIndex(index === activeTaskIndex ? null : index);
    };

    // Alternar menu de compartilhamento
    const handleToggleShareMenu = (): void => {
        setIsShareMenuVisible(!isShareMenuVisible);
    };

    return (
        <View style={styles.container}>
            {/* Campos de entrada e botão de adicionar */}
            <View style={styles.inputContainer}>
                <View style={styles.textInputs}>
                    <TextInput
                        style={styles.input}
                        placeholder="Title..."
                        placeholderTextColor="#F0E3CA"
                        value={title}
                        onChangeText={setTitle}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="About..."
                        placeholderTextColor="#F0E3CA"
                        value={about}
                        onChangeText={setAbout}
                    />
                </View>
                <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </View>

            {/* Lista de tarefas */}
            <ScrollView style={styles.scrollView}>
                {tasks.length === 0 ? (
                    <View style={styles.noTaskContainer}>
                        <View style={styles.noTaskUnderline}></View>
                        <Text style={styles.noTaskText}>No tasks </Text>
                        <View style={styles.noTaskUnderline}></View>
                    </View>
                ) : (
                    tasks.map((task, index) => (
                        <View key={task.id} style={styles.taskItem}>
                            <TouchableOpacity
                                style={styles.taskContent}
                                onPress={() => handleToggleTask(index)}
                            >
                                <View style={styles.taskTextContainer}>
                                    <Text style={styles.taskTitle}>{task.title}</Text>
                                    <Text style={styles.taskAbout}>{task.about}</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.removeButton}
                                    onPress={() => handleRemoveTask(task.id)}
                                >
                                    <Text style={styles.removeButtonText}>X</Text>
                                </TouchableOpacity>
                            </TouchableOpacity>

                            {/* Ícones de ação */}
                            {activeTaskIndex === index && (
                                <View style={styles.actionIcons}>
                                    <TouchableOpacity onPress={handleToggleShareMenu}>
                                        <Ionicons
                                            name="share-social"
                                            size={24}
                                            color="#FF8303"
                                            style={styles.icon}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <Ionicons
                                            name="information-circle"
                                            size={24}
                                            color="#FF8303"
                                            style={styles.icon}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleEditTask(task)}>
                                        <Ionicons
                                            name="create"
                                            size={24}
                                            color="#FF8303"
                                            style={styles.icon}
                                        />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    ))
                )}
            </ScrollView>

            {/* Modal de confirmação de exclusão */}
            <Modal
                visible={isDeleteModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsDeleteModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>Delete this task? </Text>
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={handleConfirmDeleteTask}
                            >
                                <Text style={styles.modalButtonText}>Yes </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => setIsDeleteModalVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>No </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal de edição de tarefas */}
            <Modal
                visible={isEditModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsEditModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.editModalContainer}>
                        <Text style={styles.editModalTitle}>Edit Task </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Edit Title..."
                            placeholderTextColor="#F0E3CA"
                            value={editTaskTitle}
                            onChangeText={setEditTaskTitle}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Edit About..."
                            placeholderTextColor="#F0E3CA"
                            value={editTaskAbout}
                            onChangeText={setEditTaskAbout}
                        />
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={handleSaveEditedTask}
                        >
                            <Text style={styles.modalButtonText}>Save </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setIsEditModalVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>Cancel </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {/* Menu de compartilhamento no final da tela */}
            {isShareMenuVisible && (
                <View style={styles.shareMenu}>
                    <TouchableOpacity style={styles.shareIcon}>
                        <Ionicons name="copy" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.shareIcon}>
                        <FontAwesome name="vk" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.shareIcon}>
                        <FontAwesome name="telegram" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.shareIcon}>
                        <FontAwesome name="whatsapp" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.shareIcon}>
                        <FontAwesome name="facebook" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1A1A1A',
        padding: 20,
        paddingTop: 60,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    textInputs: {
        flex: 1,
        marginRight: 10,
    },
    input: {
        backgroundColor: '#333333',
        color: '#FFFFFF',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#FF7F00',
    },
    addButton: {
        backgroundColor: '#1A1A1A',
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#FF7F00',
    },
    addButtonText: {
        fontSize: 40,
        color: '#FF7F00',
    },
    scrollView: {
        flex: 1,
    },
    noTaskContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
    noTaskText: {
        color: '#F0E3CA',
        fontSize: 20,
    },
    noTaskUnderline: {
        width: 60,
        height: 2,
        backgroundColor: '#FF7F00',
        marginTop: 5,
    },
    taskItem: {
        marginBottom: 10,
    },
    taskContent: {
        flexDirection: 'row',
        backgroundColor: '#333333',
        padding: 15,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#FF7F00',
        alignItems: 'center',
    },
    taskTextContainer: {
        flex: 1,
    },
    taskTitle: {
        color: '#FFFFFF',
        fontSize: 18,
    },
    taskAbout: {
        color: '#AAAAAA',
        fontSize: 14,
    },
    removeButton: {
        backgroundColor: '#2B2A27',
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        borderColor: '#A35709',
        borderWidth: 3,
    },
    removeButtonText: {
        color: '#FF8303',
        fontSize: 18,
    },
    actionIcons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
        backgroundColor: '#1A1A1A',
        padding: 10,
        borderRadius: 5,
        borderColor: '#FF7F00',
        borderWidth: 1,
    },
    shareMenu: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#333333',
        padding: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    shareIcon: {
        marginHorizontal: 10,
    },
    icon: {
        marginHorizontal: 5,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: 300,
        backgroundColor: '#333333',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalText: {
        color: '#FFFFFF',
        fontSize: 18,
        marginBottom: 20,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#FF8303',
        padding: 10,
        borderRadius: 5,
        width: '35%',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
    },
    modalButtonText: {
        color: '#FF8303',
        fontSize: 16,
    },
    editModalContainer: {
        width: '90%',
        backgroundColor: '#353535',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    editModalTitle: {
        fontSize: 18,
        color: '#F0E3CA',
        marginBottom: 10,
    },
});

export default ToDoListScreen;